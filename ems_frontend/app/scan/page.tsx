'use client';

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
import { GuestActions } from "@/app/dashboard/my-events/[id]/guests/utils";
import Link from "next/link"
import { WretchError } from "wretch/resolver";
import { AuthActions } from "@/app/auth/utils";

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<{ name: string; message: string } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [scanning, setScanning] = useState(false)
    const [scannerReady, setScannerReady] = useState(false)
    const { checkInGuest } = GuestActions()
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const { handleJWTRefresh } = AuthActions();

    const startScanning = () => {
        setScanning(true)
        setScanResult(null)
        setError(null)
        setScannerReady(false)

        setTimeout(() => {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    qrbox: { width: 280, height: 280 },
                    fps: 10,
                },
                false
            )

            scannerRef.current.render(
                async (decodedText) => {
                    scannerRef.current?.clear()
                    setScanning(false)

                    try {
                        const data = JSON.parse(decodedText)

                        const response = await checkInGuest({
                            guest_id: data.guest_id,
                            event_id: data.event_id, // ✅ FIXED
                            email: data.email,
                        })

                        setScanResult({
                            name: data.name || "Guest",
                            message: response.message || "Successfully checked in!",
                        })

                        setTimeout(() => setScanResult(null), 4000)
                    } catch (err) {
                        setScanning(false);
                        setScanResult(null)
                        setError("Invalid QR! Failed to check in guest. Please try again.")
                        setScannerReady(false)
                        // check if error is wretcherror and try to refresh token
                        // if (err instanceof WretchError && err.response) {
                        //     const res = await err.response.clone().json();

                        //     if (res?.code === "token_not_valid") {
                        //         setScanning(false)

                        //         try {
                        //             await handleJWTRefresh();
                        //             startScanning();
                        //             return;
                        //         } catch (refreshErr) {
                        //             console.error("JWT refresh failed during scan:", refreshErr);
                        //         } finally {
                        //             setScanning(false);
                        //         }
                        //     }
                        // }
                    }
                },
                (err) => console.warn(err)
            )

            setScannerReady(true)
        }, 100)
    }

    const handleRetry = () => {
        setError(null)
        startScanning()
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-foreground">EventFlow</h1>
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg mb-6">
                        <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-balance text-foreground mb-3">Guest Check-In</h1>
                    <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-md mx-auto">
                        Scan guest QR codes to verify attendance and check them into your event
                    </p>
                </div>

                {!scanning && !scanResult && !error && (
                    <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-8 shadow-xl text-center">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mb-3">Ready to Scan</h2>
                        <p className="text-muted-foreground mb-8 text-pretty">
                            Position the guest's QR code within the camera frame to check them in
                        </p>
                        <button
                            onClick={startScanning}
                            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            Start Scanning
                        </button>
                    </div>
                )}

                {scanning && (
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-r from-primary to-accent p-4 text-center">
                            <p className="text-primary-foreground font-semibold text-lg">Scanning Active</p>
                            <p className="text-primary-foreground/80 text-sm">Position QR code in the frame</p>
                        </div>
                        <div className="p-6 bg-muted/30">
                            <div id="reader" className="rounded-xl overflow-hidden"></div>
                        </div>
                        <div className="p-4 border-t border-border">
                            <button
                                onClick={() => {
                                    scannerRef.current?.clear()
                                    scannerRef.current = null
                                    setScanning(false)
                                    setScanResult(null)
                                    setError(null)
                                }}
                                className="w-full px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-medium transition-colors"
                            >
                                Cancel Scanning
                            </button>
                        </div>
                    </div>
                )}

                {scanResult && (
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-8 shadow-xl text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-700">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">Check-In Successful!</h2>
                        <p className="text-xl text-green-600 dark:text-green-400 mb-4">{scanResult.name}</p>
                        <p className="text-muted-foreground text-sm">{scanResult.message}</p>
                        <button
                            onClick={startScanning}
                            className="mt-6 px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            Scan Next Guest
                        </button>
                    </div>
                )}

                {error && (
                    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-8 shadow-xl text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">Check-In Failed</h2>
                        <p className="text-lg text-red-600 dark:text-red-400 mb-6">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}

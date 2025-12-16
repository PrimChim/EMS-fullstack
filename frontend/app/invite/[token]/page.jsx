"use client";

import {QRCodeCanvas} from "qrcode.react";

export default async function InvitePage({ params }) {
  const { token } = await params;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Invitation</h1>
      <p className="mb-4 text-gray-600">Show this QR at the event gate:</p>

      <div className="bg-white p-6 rounded shadow w-fit mx-auto">
        <QRCodeCanvas value={token} size={200} />
      </div>

      <p className="mt-4 break-all text-center">{token}</p>
    </main>
  );
}

"use client";

interface Props {
  message: string;
}

export default function ErrorScreen({ message }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dce5dc]">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100">
        <p className="text-red-500 font-body text-lg mb-2">Erro de conexão</p>
        <p className="text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="bg-earth-50 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <p className="font-serif text-3xl text-earth-900">Admin access</p>
        <p className="mt-3 text-sm text-earth-600">
          This area is protected. Access it directly via the URL with HTTP Basic
          Auth, or configure your browser to send credentials for{" "}
          <code className="text-xs bg-earth-100 px-1 rounded">/admin/*</code>.
        </p>
        <p className="mt-4 text-xs text-earth-400">
          Username: <code>admin</code> · Password: value of{" "}
          <code>ADMIN_SECRET</code> env var
        </p>
      </div>
    </div>
  );
}

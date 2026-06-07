import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Battery ERP Platform</h1>
      <p>Welcome to the Battery ERP System</p>
      <nav style={{ marginTop: '24px' }}>
        <Link href="/inventory">
          <button style={{ padding: '10px 16px', cursor: 'pointer' }}>Go to Inventory Management</button>
        </Link>
      </nav>
    </main>
  );
}

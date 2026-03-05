export function Announcements() {
  console.log('=== ANNOUNCEMENTS COMPONENT RENDERING ===');
  
  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ea7800', marginBottom: '20px' }}>
        ANNOUNCEMENTS PAGE TEST
      </h1>
      <p style={{ fontSize: '18px', color: '#333' }}>
        If you can see this, the Announcements component is rendering correctly.
      </p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <p>This is a minimal test version of the Announcements page.</p>
        <p>The full version will be restored once we confirm this works.</p>
      </div>
    </div>
  );
}

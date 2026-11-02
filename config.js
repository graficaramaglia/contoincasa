// ContoInCasa: collegamento al database Supabase.
// Incolla qui i due valori che trovi su supabase.com,
// nel tuo progetto: Project Settings → API (o "Data API").
// La "anon public key" è fatta per stare nell'app: i dati restano protetti
// perché solo chi ha email e password create da te può leggerli.
window.CONTOINCASA = {
  supabaseUrl: "https://mvgnhlgultpdeoxpcfgk.supabase.co",       // es. https://abcdefgh.supabase.co
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z25obGd1bHRwZGVveHBjZmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MTE1NDYsImV4cCI6MjEwOTE4NzU0Nn0.uktlj4ALPvHTeadZ02PzDzCbivn25HkLbi8ZrqwvXI4"    // una stringa lunga che inizia con eyJ...
};
if (/INCOLLA-QUI/.test(window.CONTOINCASA.supabaseUrl)) window.CONTOINCASA = {};
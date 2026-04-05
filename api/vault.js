import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Lecture des données (Quand quelqu'un ouvre le site)
    if (req.method === 'GET') {
        try {
            const total = await kv.get('vault_total') || 0.045;
            const leader = await kv.get('vault_leader') || "Personne pour l'instant";
            return res.status(200).json({ total, leader });
        } catch (error) {
            return res.status(500).json({ error: "Erreur KV" });
        }
    }

    // Mise à jour (Quand quelqu'un clique sur UNLOCK et paie)
    if (req.method === 'POST') {
        const { amount, user } = req.body;
        try {
            const current = await kv.get('vault_total') || 0;
            const newTotal = parseFloat(current) + parseFloat(amount);
            
            await kv.set('vault_total', newTotal);
            await kv.set('vault_leader', user);
            
            return res.status(200).json({ total: newTotal, leader: user });
        } catch (error) {
            return res.status(500).json({ error: "Erreur Maj" });
        }
    }
}

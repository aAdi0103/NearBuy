import axios from 'axios'
export const nominationn = async (req, res) => {
    const { query } = req.query;
    console.log(query);
    if (!query) return res.status(400).json({ error: "Query is required" });
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: query,
                format: "json",
                addressdetails: 1,
                limit: 5
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
};
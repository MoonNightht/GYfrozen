import multer from 'multer';
import nextConnect from 'next-connect';
import { products, getImageUrl, nextId } from '../../utils/db';

const upload = multer({ storage: multer.memoryStorage() });
const apiRoute = nextConnect();

apiRoute.use(upload.single('image'));

apiRoute.get((req, res) => {
  const result = products.map(p => ({
    ...p,
    imageUrl: p.image ? getImageUrl(p.image) : null,
  }));
  res.json(result);
});

apiRoute.post((req, res) => {
  if (req.query.admin !== 'true') return res.status(403).json({ error: 'Access denied' });

  const { name, available, retailPrice, wholesalePrice } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const product = {
    id: nextId(),
    name,
    available: available === 'true',
    retailPrice: parseFloat(retailPrice),
    wholesalePrice: parseFloat(wholesalePrice),
    image: req.file?.originalname || null, // ต้องใช้ cloud storage จริงในโปรดักชัน
  };
  products.push(product);
  res.json({ success: true, product });
});

export default apiRoute;
export const config = { api: { bodyParser: false } };

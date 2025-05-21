import multer from 'multer';
import nextConnect from 'next-connect';
import { products } from '../../utils/db';

const upload = multer({ storage: multer.memoryStorage() });
const apiRoute = nextConnect();

apiRoute.use(upload.single('image'));

apiRoute.put((req, res) => {
  if (req.query.admin !== 'true') return res.status(403).json({ error: 'Access denied' });

  const id = parseInt(req.query.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { name, available, retailPrice, wholesalePrice } = req.body;
  if (name) product.name = name;
  if (available !== undefined) product.available = available === 'true';
  if (retailPrice) product.retailPrice = parseFloat(retailPrice);
  if (wholesalePrice) product.wholesalePrice = parseFloat(wholesalePrice);
  if (req.file) product.image = req.file.originalname;

  res.json({ success: true, product });
});

apiRoute.delete((req, res) => {
  if (req.query.admin !== 'true') return res.status(403).json({ error: 'Access denied' });

  const id = parseInt(req.query.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products.splice(index, 1);
  res.json({ success: true });
});

export default apiRoute;
export const config = { api: { bodyParser: false } };

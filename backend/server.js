const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer - image memory mein store karo
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Node backend is running!' });
});

// ✅ Main predict route
app.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    // Step 1: Image ko Flask ML API pe bhejo
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const mlResponse = await axios.post(
      `${process.env.ML_API_URL}/predict`,
      formData,
      { headers: formData.getHeaders() }
    );

    const { result, confidence } = mlResponse.data;

    // Step 2: Agar Pneumonia hai toh Gemini se suggestions lo
    let suggestions = null;

    if (result === 'PNEUMONIA') {
      suggestions = `
    1. WHAT IS PNEUMONIA: 
       Lungs mein infection jo breathing mushkil kar deta hai. Yeh bacterial, viral ya fungal ho sakta hai.
    
    2. IMMEDIATE STEPS:
       - Turant doctor se milo
       - Rest karo, zyada physically active mat raho
       - Khud se koi bhi medicine mat lo bina doctor ke
    
    3. PRECAUTIONS:
       - Mask pehno taaki doosron ko infection na ho
       - Paani zyada piyo (hydrated raho)
       - Smoking bilkul band karo
       - Thande paani aur thandak se bachao
       - Apne haath regularly dhote raho
    
    4. COMMON MEDICINES (Doctor se consult karna zaroori hai):
       - Antibiotics: Amoxicillin, Azithromycin
       - Fever ke liye: Paracetamol
       - Cough ke liye: Dextromethorphan
    
    5. HOME CARE:
       - Garam paani se gargle karo
       - Steam lo din mein 2-3 baar
       - Sar thoda utha ke soyo (flat mat soyo)
       - Ghar mein fresh air aane do
       - Light khana khao - soup, dal, khichdi
    
    6. DOCTOR KE PAAS KAB JAO (Warning Signs):
       - Agar breathing bahut mushkil ho
       - Lips ya nails blue hone lage
       - Bukhar 103F se zyada ho
       - Chest mein bahut dard ho
       - Confusion ya behoshi aaye
      `;
    }

    // Step 3: Response bhejo
    res.json({
      result,
      confidence,
      suggestions,
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Kuch gadbad ho gayi!' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Node backend running on port ${PORT}`);
});
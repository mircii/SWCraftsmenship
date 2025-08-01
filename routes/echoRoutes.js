const express = require('express');
const xss = require('xss');
const router = express.Router();

/**
 * @openapi
 * /echo/unsafe:
 *   post:
 *     summary: Echo user input (unsafe, XSS vulnerable)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 example: "<script>alert('xss')</script>"
 *     responses:
 *       200:
 *         description: Echoes the raw user input (unsafe)
 */
router.post('/unsafe', (req, res) => {
  const { input } = req.body;
  res.send(`<div>User says: ${input}</div>`);
});

/**
 * @openapi
 * /echo/safe:
 *   post:
 *     summary: Echo user input (safe, sanitized)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 example: "<script>alert('xss')</script>"
 *     responses:
 *       200:
 *         description: Echoes the sanitized user input
 */
router.post('/safe', (req, res) => {
  const { input } = req.body;
  const sanitized = xss(input);
  res.send(`<div>User says: ${sanitized}</div>`);
});

module.exports = router;
const https = require('https');

function checkRoute(path) {
  return new Promise((resolve) => {
    https.get(`https://www.filingby.com${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          dataLength: data.length,
          snippet: data.slice(0, 300)
        });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function checkDeployment() {
  console.log('Checking live deployment status...');
  // We can check if /tools/structure-selector returns 200 with noindex
  const toolCheck = await checkRoute('/tools/structure-selector');
  // And check if /wpm returns 404
  const wpmCheck = await checkRoute('/wpm');
  // And check /cart returns 404
  const cartCheck = await checkRoute('/cart');

  console.log(`/tools/structure-selector -> Status: ${toolCheck.status}`);
  console.log(`/wpm -> Status: ${wpmCheck.status}`);
  console.log(`/cart -> Status: ${cartCheck.status}`);
  if (toolCheck.headers) {
    console.log(`Vercel Cache: ${toolCheck.headers['x-vercel-cache']}, Age: ${toolCheck.headers['age']}, Server: ${toolCheck.headers['server']}, Date: ${toolCheck.headers['date']}`);
    console.log(`Vercel ID: ${toolCheck.headers['x-vercel-id']}`);
  }

  const isLive = toolCheck.status === 200 && wpmCheck.status === 404 && cartCheck.status === 404;
  console.log(`Phase 1.3 Deployment Live: ${isLive ? 'YES! 🎉' : 'Deploying/Waiting...'}`);
  return isLive;
}

async function run() {
  for (let attempt = 1; attempt <= 20; attempt++) {
    console.log(`\n--- Attempt ${attempt} (${attempt * 10}s) ---`);
    const isLive = await checkDeployment();
    if (isLive) {
      console.log('DEPLOYMENT VERIFIED LIVE!');
      process.exit(0);
    }
    await new Promise(r => setTimeout(r, 10000));
  }
  console.log('Timeout waiting for deployment');
  process.exit(1);
}

run();

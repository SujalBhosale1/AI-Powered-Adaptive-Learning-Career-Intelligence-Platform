const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("REGISTER RESPONSE STATUS:", res.statusCode);
    const parsed = JSON.parse(data);
    console.log("REGISTER RESPONSE BODY:", JSON.stringify(parsed, null, 2));

    if (parsed.success && parsed.token) {
      // Now test the profile setup
      const setupOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/user/setup',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsed.token}`
        },
      };

      const req2 = http.request(setupOptions, (res2) => {
        let setupData = '';
        res2.on('data', (c) => setupData += c);
        res2.on('end', () => {
          console.log("SETUP RESPONSE STATUS:", res2.statusCode);
          console.log("SETUP RESPONSE BODY:", JSON.stringify(JSON.parse(setupData), null, 2));
        });
      });

      req2.write(JSON.stringify({
        branch: 'CS',
        year: 3,
        college: 'Test Institute',
        cgpa: 8.5,
        interests: ['coding', 'ai_ml'],
        skills: ['JavaScript'],
        goals: ['Get Placed'],
        targetRole: 'Software Engineer'
      }));
      req2.end();
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(JSON.stringify({
  name: `Test User ${Date.now()}`,
  email: `test${Date.now()}@example.com`,
  password: 'password123'
}));
req.end();

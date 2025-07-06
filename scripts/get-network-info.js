#!/usr/bin/env node

import { networkInterfaces } from 'os';

const nets = networkInterfaces();
const results = {};

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === 'IPv4' && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

console.log('\n🌐 Network Information for sharing your app:');
console.log('============================================\n');

if (Object.keys(results).length === 0) {
  console.log('❌ No external IPv4 addresses found.');
  console.log('Make sure you\'re connected to a network (WiFi or Ethernet).\n');
} else {
  console.log('✅ Found external IP addresses:');
  Object.keys(results).forEach((interfaceName) => {
    results[interfaceName].forEach((ip) => {
      console.log(`   ${interfaceName}: ${ip}`);
    });
  });
  
  console.log('\n📱 To share with other users on the same network:');
  console.log('   Development server: http://[YOUR_IP]:5173');
  console.log('   Preview server:     http://[YOUR_IP]:4173');
  console.log('\n💡 Commands to run:');
  console.log('   npm run dev:network     # Development server accessible from network');
  console.log('   npm run serve          # Build and serve production version');
  console.log('\n⚠️  Note: Make sure your firewall allows connections on these ports.\n');
} 
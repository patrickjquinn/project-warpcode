import App from './App.svelte'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new App({
	target: document.getElementById('app')
})

export default app

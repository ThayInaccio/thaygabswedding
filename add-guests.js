import axios from 'axios';

const GUESTS = [
  "Naira Bianca",
  "Alexandre Ferreira",
  "Marina Freire",
  "Victor Freire",
  "Julia Freire",
  "Mariana Amariz",
  "Natalia Juri",
  "Marcelo Donizetti Custodio",
  "Lídia",
  "Felipe Juri",
  "Marília Contessoto",
  "Marina Contessoto",
  "Mariana Devincentes",
  "José Henrique Gomes Ferreira",
  "Cintra D'alessandro",
  "Sabrina D'alessandro",
  "Simone Soares",
  "Marcelo Alves",
  "Silvana Soares",
  "Edvaldo",
  "Beatriz Vieira",
  "Maria de Fatima Coelho",
  "Junior Soares",
  "Janaire Silva",
  "Gabriel Soares",
  "Vitor Soares",
  "Gustavo Soares",
  "Manu Vieira",
  "Priscila Leite",
  "Jason Oliveira",
  "Adriana Zoppello",
  "Johnlivio Medeiros",
  "Leticia Mattos",
  "Thiago Carvalhaes"
];

const API_URL = 'http://localhost:3001/api/rsvp';

async function main() {
  // 1. Fetch current guests
  const { data } = await axios.get(API_URL);
  const existingNames = new Set(data.data.map(g => g.name.trim().toLowerCase()));

  // 2. Add missing guests
  for (const name of GUESTS) {
    if (!existingNames.has(name.trim().toLowerCase())) {
      try {
        await axios.post(API_URL, {
          name,
          attending: true,
          numberOfGuests: 1,
          confirmed: null
        });
        console.log(`Added: ${name}`);
      } catch (err) {
        console.error(`Failed to add ${name}:`, err.response?.data || err.message);
      }
    } else {
      console.log(`Already exists: ${name}`);
    }
  }
}

main(); 
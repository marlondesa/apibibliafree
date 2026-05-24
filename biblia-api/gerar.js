/**
 * Script para gerar a API estática da Bíblia ACF
 *
 * Como usar:
 * 1. node gerar.js
 *
 * Isso vai gerar todos os arquivos JSON na pasta /api
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const URL_BIBLIA = 'https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/acf.json';

// Mapeamento: abbrev -> nome completo e slug
const LIVROS = [
  { abbrev: "gn",   nome: "Gênesis",           slug: "genesis",            testamento: "AT" },
  { abbrev: "ex",   nome: "Êxodo",              slug: "exodo",              testamento: "AT" },
  { abbrev: "lv",   nome: "Levítico",           slug: "levitico",           testamento: "AT" },
  { abbrev: "nm",   nome: "Números",            slug: "numeros",            testamento: "AT" },
  { abbrev: "dt",   nome: "Deuteronômio",       slug: "deuteronomio",       testamento: "AT" },
  { abbrev: "js",   nome: "Josué",              slug: "josue",              testamento: "AT" },
  { abbrev: "jz",   nome: "Juízes",             slug: "juizes",             testamento: "AT" },
  { abbrev: "rt",   nome: "Rute",               slug: "rute",               testamento: "AT" },
  { abbrev: "1sm",  nome: "1 Samuel",           slug: "1-samuel",           testamento: "AT" },
  { abbrev: "2sm",  nome: "2 Samuel",           slug: "2-samuel",           testamento: "AT" },
  { abbrev: "1rs",  nome: "1 Reis",             slug: "1-reis",             testamento: "AT" },
  { abbrev: "2rs",  nome: "2 Reis",             slug: "2-reis",             testamento: "AT" },
  { abbrev: "1cr",  nome: "1 Crônicas",         slug: "1-cronicas",         testamento: "AT" },
  { abbrev: "2cr",  nome: "2 Crônicas",         slug: "2-cronicas",         testamento: "AT" },
  { abbrev: "ed",   nome: "Esdras",             slug: "esdras",             testamento: "AT" },
  { abbrev: "ne",   nome: "Neemias",            slug: "neemias",            testamento: "AT" },
  { abbrev: "et",   nome: "Ester",              slug: "ester",              testamento: "AT" },
  { abbrev: "job",  nome: "Jó",                 slug: "jo",                 testamento: "AT" },
  { abbrev: "sl",   nome: "Salmos",             slug: "salmos",             testamento: "AT" },
  { abbrev: "pv",   nome: "Provérbios",         slug: "proverbios",         testamento: "AT" },
  { abbrev: "ec",   nome: "Eclesiastes",        slug: "eclesiastes",        testamento: "AT" },
  { abbrev: "ct",   nome: "Cantares",           slug: "cantares",           testamento: "AT" },
  { abbrev: "is",   nome: "Isaías",             slug: "isaias",             testamento: "AT" },
  { abbrev: "jr",   nome: "Jeremias",           slug: "jeremias",           testamento: "AT" },
  { abbrev: "lm",   nome: "Lamentações",        slug: "lamentacoes",        testamento: "AT" },
  { abbrev: "ez",   nome: "Ezequiel",           slug: "ezequiel",           testamento: "AT" },
  { abbrev: "dn",   nome: "Daniel",             slug: "daniel",             testamento: "AT" },
  { abbrev: "os",   nome: "Oséias",             slug: "oseias",             testamento: "AT" },
  { abbrev: "jl",   nome: "Joel",               slug: "joel",               testamento: "AT" },
  { abbrev: "am",   nome: "Amós",               slug: "amos",               testamento: "AT" },
  { abbrev: "ob",   nome: "Obadias",            slug: "obadias",            testamento: "AT" },
  { abbrev: "jn",   nome: "Jonas",              slug: "jonas",              testamento: "AT" },
  { abbrev: "mq",   nome: "Miquéias",           slug: "miqueias",           testamento: "AT" },
  { abbrev: "na",   nome: "Naum",               slug: "naum",               testamento: "AT" },
  { abbrev: "hc",   nome: "Habacuque",          slug: "habacuque",          testamento: "AT" },
  { abbrev: "sf",   nome: "Sofonias",           slug: "sofonias",           testamento: "AT" },
  { abbrev: "ag",   nome: "Ageu",               slug: "ageu",               testamento: "AT" },
  { abbrev: "zc",   nome: "Zacarias",           slug: "zacarias",           testamento: "AT" },
  { abbrev: "ml",   nome: "Malaquias",          slug: "malaquias",          testamento: "AT" },
  { abbrev: "mt",   nome: "Mateus",             slug: "mateus",             testamento: "NT" },
  { abbrev: "mc",   nome: "Marcos",             slug: "marcos",             testamento: "NT" },
  { abbrev: "lc",   nome: "Lucas",              slug: "lucas",              testamento: "NT" },
  { abbrev: "jo",   nome: "João",               slug: "joao",               testamento: "NT" },
  { abbrev: "at",   nome: "Atos",               slug: "atos",               testamento: "NT" },
  { abbrev: "rm",   nome: "Romanos",            slug: "romanos",            testamento: "NT" },
  { abbrev: "1co",  nome: "1 Coríntios",        slug: "1-corintios",        testamento: "NT" },
  { abbrev: "2co",  nome: "2 Coríntios",        slug: "2-corintios",        testamento: "NT" },
  { abbrev: "gl",   nome: "Gálatas",            slug: "galatas",            testamento: "NT" },
  { abbrev: "ef",   nome: "Efésios",            slug: "efesios",            testamento: "NT" },
  { abbrev: "fp",   nome: "Filipenses",         slug: "filipenses",         testamento: "NT" },
  { abbrev: "cl",   nome: "Colossenses",        slug: "colossenses",        testamento: "NT" },
  { abbrev: "1ts",  nome: "1 Tessalonicenses",  slug: "1-tessalonicenses",  testamento: "NT" },
  { abbrev: "2ts",  nome: "2 Tessalonicenses",  slug: "2-tessalonicenses",  testamento: "NT" },
  { abbrev: "1tm",  nome: "1 Timóteo",          slug: "1-timoteo",          testamento: "NT" },
  { abbrev: "2tm",  nome: "2 Timóteo",          slug: "2-timoteo",          testamento: "NT" },
  { abbrev: "tt",   nome: "Tito",               slug: "tito",               testamento: "NT" },
  { abbrev: "fm",   nome: "Filemon",            slug: "filemon",            testamento: "NT" },
  { abbrev: "hb",   nome: "Hebreus",            slug: "hebreus",            testamento: "NT" },
  { abbrev: "tg",   nome: "Tiago",              slug: "tiago",              testamento: "NT" },
  { abbrev: "1pe",  nome: "1 Pedro",            slug: "1-pedro",            testamento: "NT" },
  { abbrev: "2pe",  nome: "2 Pedro",            slug: "2-pedro",            testamento: "NT" },
  { abbrev: "1jo",  nome: "1 João",             slug: "1-joao",             testamento: "NT" },
  { abbrev: "2jo",  nome: "2 João",             slug: "2-joao",             testamento: "NT" },
  { abbrev: "3jo",  nome: "3 João",             slug: "3-joao",             testamento: "NT" },
  { abbrev: "jd",   nome: "Judas",              slug: "judas",              testamento: "NT" },
  { abbrev: "ap",   nome: "Apocalipse",         slug: "apocalipse",         testamento: "NT" },
];

function baixarBiblia() {
  return new Promise((resolve, reject) => {
    console.log('Baixando dados da Bíblia ACF...');
    https.get(URL_BIBLIA, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Remove BOM se existir
        const limpo = data.replace(/^\uFEFF/, '');
        console.log('Download concluído!');
        resolve(JSON.parse(limpo));
      });
    }).on('error', reject);
  });
}

function salvarJSON(caminho, dados) {
  fs.mkdirSync(path.dirname(caminho), { recursive: true });
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8');
}

async function gerarAPI(biblia) {
  const pastaAPI = path.join(__dirname, 'api');
  fs.mkdirSync(pastaAPI, { recursive: true });

  const livrosIndex = [];
  let totalVersiculos = 0;

  biblia.forEach((livro, indexLivro) => {
    const info = LIVROS.find(l => l.abbrev === livro.abbrev) || {
      nome: livro.abbrev,
      slug: livro.abbrev,
      testamento: indexLivro < 39 ? 'AT' : 'NT'
    };

    const pastaLivro = path.join(pastaAPI, info.slug);
    console.log(`Gerando: ${info.nome} (${livro.chapters.length} capítulos)`);

    const infoLivro = {
      id: indexLivro + 1,
      abbrev: livro.abbrev,
      nome: info.nome,
      slug: info.slug,
      testamento: info.testamento === 'AT' ? 'Antigo Testamento' : 'Novo Testamento',
      total_capitulos: livro.chapters.length,
    };

    livrosIndex.push(infoLivro);

    // Índice do livro
    salvarJSON(path.join(pastaLivro, 'index.json'), {
      ...infoLivro,
      capitulos: livro.chapters.map((cap, i) => ({
        numero: i + 1,
        total_versiculos: cap.length,
      }))
    });

    // Cada capítulo
    livro.chapters.forEach((capitulo, indexCapitulo) => {
      totalVersiculos += capitulo.length;
      salvarJSON(path.join(pastaLivro, `${indexCapitulo + 1}.json`), {
        livro: info.nome,
        slug_livro: info.slug,
        testamento: infoLivro.testamento,
        capitulo: indexCapitulo + 1,
        total_versiculos: capitulo.length,
        versiculos: capitulo.map((texto, i) => ({
          numero: i + 1,
          texto: texto
        }))
      });
    });
  });

  // Índice geral
  salvarJSON(path.join(pastaAPI, 'index.json'), {
    nome: 'Bíblia Sagrada',
    versao: 'Almeida Corrigida Fiel (ACF)',
    total_livros: biblia.length,
    total_versiculos: totalVersiculos,
    livros: livrosIndex
  });

  console.log('\n✓ API gerada com sucesso!');
  console.log(`✓ ${biblia.length} livros processados`);
  console.log(`✓ ${totalVersiculos.toLocaleString()} versículos no total`);
  console.log(`✓ Arquivos salvos em: ${pastaAPI}`);
  console.log('\nPróximo passo: suba a pasta /api para o GitHub e ative o GitHub Pages!');
}

async function main() {
  try {
    const biblia = await baixarBiblia();
    await gerarAPI(biblia);
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

main();

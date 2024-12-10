const displayTempo = document.getElementById('tempo');
const displayMensagem = document.getElementById('mensagem');
const botaoVerificar = document.getElementById('botaoVerificar');
const areaTrabalho = document.getElementById('area-trabalho');

let tempoRestante = 60;
let cronometro;
let iconeSelecionado = null;
let cronometroPausado = false;


// Ícones disponíveis formato aceitado no firebase
// const icones = [
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Farquivo-foto.png?alt=media', tipo: 'jpeg' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Fpdf.png?alt=media', tipo: 'pdf' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Fpasta.png?alt=media', tipo: 'pasta' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Farquivo-txt.png?alt=media', tipo: 'txt' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Fpdf.png?alt=media', tipo: 'pdf' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Farquivo-foto.png?alt=media', tipo: 'jpeg' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Farquivo-txt.png?alt=media', tipo: 'txt' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Fpdf.png?alt=media', tipo: 'pdf' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Farquivo-txt.png?alt=media', tipo: 'txt' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Fpasta.png?alt=media', tipo: 'pasta' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Farquivo-foto.png?alt=media', tipo: 'jpeg' },
//   { src: '../o/A3.C16.H1.EM.2024.Q3092.P%2Fimagens%2Fpasta.png?alt=media', tipo: 'pasta' },
// ];

// Ícones disponíveis
const icones = [
  { src: './imagens/arquivo-foto.png', tipo: 'jpeg' },
  { src: './imagens/pdf.png', tipo: 'pdf' },
  { src: './imagens/pasta.png', tipo: 'pasta' },
  { src: './imagens/arquivo-txt.png', tipo: 'txt' },
  { src: './imagens/pdf.png', tipo: 'pdf' },
  { src: './imagens/arquivo-foto.png', tipo: 'jpeg' },
  { src: './imagens/arquivo-txt.png', tipo: 'txt' },
  { src: './imagens/pdf.png', tipo: 'pdf' },
  { src: './imagens/arquivo-txt.png', tipo: 'txt' },
  { src: './imagens/pasta.png', tipo: 'pasta' },
  { src: './imagens/arquivo-foto.png', tipo: 'jpeg' },
  { src: './imagens/pasta.png', tipo: 'pasta' },
];

const tiposQuantidade = {
  txt: icones.filter(icone => icone.tipo === 'txt').length,
  jpeg: icones.filter(icone => icone.tipo === 'jpeg').length,
  pdf: icones.filter(icone => icone.tipo === 'pdf').length,
  pasta: icones.filter(icone => icone.tipo === 'pasta').length,
};

// Função para pausar o cronômetro
function pausarCronometro() {
  clearInterval(cronometro);
  cronometroPausado = true;
  // Se você quiser pausar o cronômetro na interface, pode atualizar o tempo visível
  displayTempo.textContent = tempoRestante;
}

function iniciarCronometro() {
  cronometro = setInterval(() => {
    if (!cronometroPausado) {
      tempoRestante--;
      displayTempo.textContent = tempoRestante;
      if (tempoRestante === 0) {
        clearInterval(cronometro);
        verificarOrganizacao();
      }
    }
  }, 1000);
}

// Função para embaralhar os ícones
function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para gerar a área de trabalho
function gerarAreaTrabalho() {
  // Embaralhar os ícones
  embaralharArray(icones);

  for (let i = 0; i < 32; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');

    // Preencher os slots com ícones (se disponíveis)
    if (i < icones.length) {
      const icone = document.createElement('img');
      icone.src = icones[i].src;
      icone.classList.add('icone', icones[i].tipo);
      icone.draggable = true;
      slot.appendChild(icone);

      // Eventos para arrastar o ícone em desktop
      icone.addEventListener('dragstart', () => {
        icone.classList.add('arrastando');
        iconeSelecionado = icone;
      });

      icone.addEventListener('dragend', () => {
        icone.classList.remove('arrastando');
        iconeSelecionado = null;
      });

      // Adicionando suporte ao toque para dispositivos móveis
      let touchStartX, touchStartY;
      icone.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        iconeSelecionado = icone;
        icone.classList.add('arrastando');
      });

      // Evento de touchmove no celular
      icone.addEventListener('touchmove', (e) => {
        e.preventDefault();

        const touchMoveX = e.touches[0].clientX;
        const touchMoveY = e.touches[0].clientY;
        
        if (iconeSelecionado) {
          const dx = touchMoveX - touchStartX;
          const dy = touchMoveY - touchStartY;
          iconeSelecionado.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      });

      

      // Modificar o evento de touchend para garantir que a verificação seja feita após o ícone ser solto
icone.addEventListener('touchend', (e) => {
  if (iconeSelecionado) {
    iconeSelecionado.classList.remove('arrastando');
    iconeSelecionado.style.transform = '';

    // Verifica se o ícone foi solto dentro de um slot de destino
    const slotAlvo = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    if (slotAlvo && slotAlvo.classList.contains('slot') && !slotAlvo.querySelector('.icone')) {
      slotAlvo.appendChild(iconeSelecionado);

      // Chama a função para verificar o agrupamento imediato
      const tipoMovido = iconeSelecionado.classList[1]; // Tipo do ícone movido
      verificarAgrupamentoImediato(tipoMovido);
    }
    iconeSelecionado = null;
  }
});

      
    }

    // Eventos para soltar nos slots
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', e => {
      e.preventDefault();
      if (iconeSelecionado && !slot.querySelector('.icone')) {
        slot.appendChild(iconeSelecionado);

        // Verifique o tipo do ícone que foi movido e chame a verificação para ele
        const tipoMovido = iconeSelecionado.classList[1]; // Pega o tipo do ícone (como 'txt', 'jpeg', etc.)
        verificarAgrupamentoImediato(tipoMovido);
      }
    });

    areaTrabalho.appendChild(slot);
  }
}

// Função para verificar se todos os ícones estão agrupados corretamente
function verificarTodosAgrupadosCorretamente() {
  const iconesCorretos = document.querySelectorAll('.icone.travado');
  if (iconesCorretos.length === icones.length) {
    // Se o número de ícones corretos for igual ao número total de ícones, todos estão agrupados
    displayMensagem.textContent = 'Parabéns, você organizou tudo corretamente! Seu código é 1.';
    displayMensagem.style.color = 'green';
    pausarCronometro(); // Pausa o cronômetro
  }
}

// Função para verificar agrupamento de ícones do tipo movido
function verificarAgrupamentoImediato(tipoMovido) {
  const slots = Array.from(areaTrabalho.querySelectorAll('.slot'));
  const numSlots = slots.length;
  const numColunas = 8; // Número de colunas da grid
  const numLinhas = Math.ceil(numSlots / numColunas);

  // Criar a grid baseada nos slots
  const grid = [];
  for (let i = 0; i < numLinhas; i++) {
    grid.push(slots.slice(i * numColunas, (i + 1) * numColunas));
  }

  // Matriz de visitados para controlar quais slots já foram verificados
  const visitados = Array(numLinhas).fill(null).map(() => Array(numColunas).fill(false));

  // Função recursiva para verificar o agrupamento por tipo
  function verificarAgrupamentoPorTipo(x, y, tipo) {
    if (x < 0 || y < 0 || x >= numLinhas || y >= numColunas) return 0; // Limites da grid
    if (visitados[x][y]) return 0; // Já foi visitado
    const icone = grid[x][y]?.querySelector('.icone');
    if (!icone || !icone.classList.contains(tipo)) return 0; // Verifica se é o ícone do tipo desejado

    visitados[x][y] = true; // Marca como visitado

    // Realiza a busca nas 4 direções: cima, baixo, esquerda, direita
    let tamanho = 1;
    tamanho += verificarAgrupamentoPorTipo(x + 1, y, tipo); // Baixo
    tamanho += verificarAgrupamentoPorTipo(x - 1, y, tipo); // Cima
    tamanho += verificarAgrupamentoPorTipo(x, y + 1, tipo); // Direita
    tamanho += verificarAgrupamentoPorTipo(x, y - 1, tipo); // Esquerda
    return tamanho;
  }

  let tamanhoGrupo = 0;
  // Verifica agrupamento de ícones do tipo movido
  for (let x = 0; x < numLinhas; x++) {
    for (let y = 0; y < numColunas; y++) {
      const icone = grid[x][y]?.querySelector('.icone');
      if (icone && icone.classList.contains(tipoMovido) && !visitados[x][y]) {
        tamanhoGrupo = verificarAgrupamentoPorTipo(x, y, tipoMovido); // Chama a verificação
      }
    }
  }

  // Verifica se o agrupamento está correto
  if (tamanhoGrupo === tiposQuantidade[tipoMovido]) {
    console.log(`Grupo de ${tipoMovido} correto e travado.`);
    // Se o agrupamento estiver correto, trava os ícones
    grid.forEach(row => row.forEach(slot => {
      const icone = slot.querySelector('.icone');
      if (icone && icone.classList.contains(tipoMovido)) {
        // Adiciona a classe 'travado' ao ícone para travá-lo visualmente e interativamente
        icone.classList.add('travado');
      }
    }));

    // Verifica se todos os ícones foram agrupados corretamente
    verificarTodosAgrupadosCorretamente();
  } else {
    console.log(`Grupo de ${tipoMovido} incorreto.`);
  }
}



// Função para desabilitar a interação
function desabilitarInteracao() {
  areaTrabalho.classList.add('desabilitar-interacao');  // Desabilita a área de trabalho
  const icones = document.querySelectorAll('.icone');
  icones.forEach(icone => {
    icone.setAttribute('draggable', 'false');  // Desabilita o arraste dos ícones
  });
}

// Função para verificar a organização quando o tempo acabar
function verificarOrganizacao() {
  const iconesCorretos = document.querySelectorAll('.icone.travado');
  if (iconesCorretos.length === icones.length) {
    displayMensagem.textContent = 'Parabéns, você organizou tudo corretamente! Seu código é 1.';
    displayMensagem.style.color = 'green';
  } else {
    displayMensagem.textContent = 'Sua organização está incorreta. O código correto é 7.';
    displayMensagem.style.color = 'red';
  }
  // Desabilita a interação após o tempo acabar
  desabilitarInteracao();
}



// function verificarOrganizacao() {
//   const slots = Array.from(areaTrabalho.querySelectorAll('.slot'));
//   const numSlots = slots.length; 
//   const numColunas = 8; 
//   const numLinhas = Math.ceil(numSlots / numColunas);

//   const grid = [];
//   for (let i = 0; i < numLinhas; i++) {
//     grid.push(slots.slice(i * numColunas, (i + 1) * numColunas));
//   }

//   const visitados = Array(numLinhas).fill(null).map(() => Array(numColunas).fill(false));

//   function verificarAgrupamentoPorTipo(x, y, tipo) {
//     if (x < 0 || y < 0 || x >= numLinhas || y >= numColunas) return 0;
//     if (visitados[x][y]) return 0;
//     const icone = grid[x][y]?.querySelector('.icone');
//     if (!icone || !icone.classList.contains(tipo)) return 0;

//     visitados[x][y] = true;

//     // Realizar verificarAgrupamentoPorTipo nas 4 direções
//     let tamanho = 1;
//     tamanho += verificarAgrupamentoPorTipo(x + 1, y, tipo);
//     tamanho += verificarAgrupamentoPorTipo(x - 1, y, tipo);
//     tamanho += verificarAgrupamentoPorTipo(x, y + 1, tipo);
//     tamanho += verificarAgrupamentoPorTipo(x, y - 1, tipo);
//     return tamanho;
//   }

//   let correto = true; 

//   // Verificar agrupamento de cada tipo
//   ['txt', 'jpeg', 'pasta', 'doc'].forEach(tipo => {
//     let encontrado = false;

//     for (let x = 0; x < numLinhas; x++) {
//       for (let y = 0; y < numColunas; y++) {
//         if (!visitados[x][y]) {
//           const icone = grid[x][y]?.querySelector('.icone');
//           if (icone && icone.classList.contains(tipo)) {
//             if (encontrado) {
              
//               correto = false;
//             }
//             encontrado = true;
//             verificarAgrupamentoPorTipo(x, y, tipo); 
//           }
//         }
//       }
//     }
//   });

//   if (correto) {
//     displayMensagem.textContent = 'Parabéns! Você organizou corretamente. O código da sua atividade é: XYZ789';
//     displayMensagem.style.color = 'green';
//   } else {
//     displayMensagem.textContent = 'Ops! A organização está incorreta. O código da sua atividade é: XYZ789';
//     displayMensagem.style.color = 'red';
//   }
// }



// // Evento do botão "VERIFICAR"
// botaoVerificar.addEventListener('click', verificarOrganizacao);

// Iniciar o cronômetro ao carregar a página
iniciarCronometro();
gerarAreaTrabalho();

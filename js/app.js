/**
 * JAVASCRIPT PRINCIPAL - PLATAFORMA DE INFRAESTRUTURA & ENGENHARIA
 * Interatividades: Simulador Multi-Etapas, Slider Antes/Depois,
 * Filtros de Serviços e Frota, e Despacho Estruturado para WhatsApp.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initServiceTabs();
  initBeforeAfterSlider();
  initFleetFilter();
  initSimulator();
  initFaqAccordion();
  initCounters();
  initWorksGallery();
  initGalleryModal();
});

/* ==========================================================================
   1. MENU MOBILE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    // Fechar menu ao clicar em links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
}

/* ==========================================================================
   2. FILTRO DE SERVIÇOS POR CATEGORIA
   ========================================================================== */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. SLIDER INTERATIVO "ANTES & DEPOIS" (COM CENÁRIOS)
   ========================================================================== */
const SCENARIOS = {
  gabiao: {
    title: 'Estabilização de Encosta: Muro de Gabião & Drenagem',
    desc: 'Talude de alta declividade com risco de deslizamento transformado em contenção segura em gabião com dreno de brita.',
    beforeImg: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop', // Solo em obra/escavação
    afterImg: 'https://images.unsplash.com/photo-1584463699042-3f1a23a31c00?q=80&w=1200&auto=format&fit=crop'   // Obra de pedra/contenção robusta
  },
  loteamento: {
    title: 'Abertura de Vias e Terraplanagem de Loteamento',
    desc: 'Área com vegetação bruta cortada, aterrada e nivelada para implantação de condomínio com drenagem e guias.',
    beforeImg: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop', // Terreno bruto
    afterImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop'   // Asfalto e vias prontas
  },
  piscina: {
    title: 'Escavação e Construção de Piscina em Desnível',
    desc: 'Solo irregular escavado com mini-escavadeira própria, contenção estrutural e piscina em concreto finalizada.',
    beforeImg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop', // Obra inicial
    afterImg: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200&auto=format&fit=crop'   // Piscina de luxo finalizada
  }
};

function initBeforeAfterSlider() {
  const rangeInput = document.getElementById('comparisonRange');
  const beforeContainer = document.getElementById('comparisonBefore');
  const sliderHandle = document.getElementById('sliderHandle');
  const scenarioBtns = document.querySelectorAll('.scenario-pill');
  const imgBefore = document.getElementById('imgBefore');
  const imgAfter = document.getElementById('imgAfter');
  const captionTitle = document.getElementById('scenarioTitle');
  const captionDesc = document.getElementById('scenarioDesc');

  if (!rangeInput || !beforeContainer || !sliderHandle) return;

  const updateSliderPosition = (val) => {
    beforeContainer.style.width = `${val}%`;
    sliderHandle.style.left = `${val}%`;
  };

  rangeInput.addEventListener('input', (e) => {
    updateSliderPosition(e.target.value);
  });

  // Alternar Cenários
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const scenarioKey = btn.getAttribute('data-scenario');
      const data = SCENARIOS[scenarioKey];

      if (data) {
        imgBefore.src = data.beforeImg;
        imgAfter.src = data.afterImg;
        captionTitle.textContent = data.title;
        captionDesc.textContent = data.desc;
        
        // Reset slider para o centro
        rangeInput.value = 50;
        updateSliderPosition(50);
      }
    });
  });
}

/* ==========================================================================
   4. FILTRO DA FROTA DE MÁQUINAS
   ========================================================================== */
function initFleetFilter() {
  const fleetBtns = document.querySelectorAll('.fleet-filter-btn');
  const fleetCards = document.querySelectorAll('.fleet-card');

  fleetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fleetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-fleet');

      fleetCards.forEach(card => {
        const cat = card.getAttribute('data-fleet-type');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. SIMULADOR DE ORÇAMENTO INTELIGENTE (MULTI-ETAPAS COM WHATSAPP)
   ========================================================================== */
const simulatorData = {
  services: [],
  projectType: 'Residencial / Chácara',
  areaSize: '',
  city: '',
  timeline: 'Imediato (15 a 30 dias)',
  notes: ''
};

function initSimulator() {
  let currentStep = 1;
  const totalSteps = 4;

  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepPanels = document.querySelectorAll('.step-panel');
  const progressBar = document.getElementById('stepProgressFill');
  const btnNext = document.getElementById('simNextBtn');
  const btnPrev = document.getElementById('simPrevBtn');
  const btnWhatsapp = document.getElementById('simSendWhatsapp');

  // Checkboxes de Serviços (Passo 1)
  const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
  serviceCheckboxes.forEach(chk => {
    chk.addEventListener('change', (e) => {
      const card = e.target.closest('.option-checkbox-card');
      if (card) {
        card.classList.toggle('selected', e.target.checked);
      }
      updateSelectedServices();
    });
  });

  function updateSelectedServices() {
    simulatorData.services = [];
    document.querySelectorAll('.service-checkbox:checked').forEach(c => {
      simulatorData.services.push(c.value);
    });
  }

  // Atualizar visual da etapa
  function updateStepUI(step) {
    stepPanels.forEach(panel => {
      panel.classList.remove('active');
      if (parseInt(panel.getAttribute('data-step')) === step) {
        panel.classList.add('active');
      }
    });

    stepIndicators.forEach(ind => {
      const indStep = parseInt(ind.getAttribute('data-step'));
      ind.classList.remove('active', 'completed');
      if (indStep === step) {
        ind.classList.add('active');
      } else if (indStep < step) {
        ind.classList.add('completed');
      }
    });

    // Barra de progresso
    if (progressBar) {
      const percentage = ((step - 1) / (totalSteps - 1)) * 80;
      progressBar.style.width = `${percentage}%`;
    }

    // Controle dos Botões
    if (btnPrev) {
      btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
    }

    if (step === totalSteps) {
      if (btnNext) btnNext.style.display = 'none';
      if (btnWhatsapp) btnWhatsapp.style.display = 'inline-flex';
      renderSummary();
    } else {
      if (btnNext) btnNext.style.display = 'inline-flex';
      if (btnWhatsapp) btnWhatsapp.style.display = 'none';
    }
  }

  // Renderizar Resumo Técnico no Passo 4
  function renderSummary() {
    const list = document.getElementById('summaryServicesList');
    const typeEl = document.getElementById('summaryProjectType');
    const areaEl = document.getElementById('summaryArea');
    const locEl = document.getElementById('summaryLocation');
    const timeEl = document.getElementById('summaryTimeline');

    if (list) {
      list.textContent = simulatorData.services.length > 0 
        ? simulatorData.services.join(', ') 
        : 'Nenhum serviço especificado';
    }
    if (typeEl) typeEl.textContent = simulatorData.projectType;
    if (areaEl) areaEl.textContent = simulatorData.areaSize || 'A definir / Medição no local';
    if (locEl) locEl.textContent = simulatorData.city || 'A informar';
    if (timeEl) timeEl.textContent = simulatorData.timeline;
  }

  // Avançar
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep === 1) {
        updateSelectedServices();
        if (simulatorData.services.length === 0) {
          alert('Por favor, selecione ao menos 1 serviço para prosseguir.');
          return;
        }
      } else if (currentStep === 2) {
        const typeSelect = document.getElementById('simProjectType');
        const areaInput = document.getElementById('simAreaSize');
        if (typeSelect) simulatorData.projectType = typeSelect.value;
        if (areaInput) simulatorData.areaSize = areaInput.value.trim();
      } else if (currentStep === 3) {
        const cityInput = document.getElementById('simCity');
        const timeSelect = document.getElementById('simTimeline');
        const notesInput = document.getElementById('simNotes');
        if (cityInput) simulatorData.city = cityInput.value.trim();
        if (timeSelect) simulatorData.timeline = timeSelect.value;
        if (notesInput) simulatorData.notes = notesInput.value.trim();
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI(currentStep);
      }
    });
  }

  // Voltar
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI(currentStep);
      }
    });
  }

  // Enviar Mensagem via WhatsApp Estruturada
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', () => {
      const phoneNumber = '5511976816103'; // WhatsApp Business Oficial J.M. Construtora
      
      const servicosText = simulatorData.services.length > 0 
        ? simulatorData.services.map(s => `• ${s}`).join('\n') 
        : '• Consulta Geral de Obras';

      const msg = 
`🏗️ *SOLICITAÇÃO DE ORÇAMENTO TÉCNICO - J.M. CONSTRUTORA*
--------------------------------------------
📋 *Serviços de Interesse:*
${servicosText}

🏢 *Tipo de Obra:* ${simulatorData.projectType}
📐 *Metragem/Dimensão Estimada:* ${simulatorData.areaSize || 'A medir no local'}
📍 *Cidade / Localização:* ${simulatorData.city || 'Não informado'}
⏱️ *Previsão de Início:* ${simulatorData.timeline}
${simulatorData.notes ? `📝 *Detalhes Adicionais:* ${simulatorData.notes}` : ''}
--------------------------------------------
🚜 _Gostaria de agendar uma visita técnica ou receber estimativa preliminar com maquinário próprio da J.M._`;

      const encodedMsg = encodeURIComponent(msg);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMsg}`, '_blank');
    });
  }
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fecha outros itens
        faqItems.forEach(i => {
          i.classList.remove('active');
          const ans = i.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   7. CONTADORES DINÂMICOS NA VISUALIZAÇÃO
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1800; // ms
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString('pt-BR');
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString('pt-BR');
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   8. FILTRO DA GALERIA DE OBRAS & VÍDEOS
   ========================================================================== */
function initWorksGallery() {
  const galleryBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-gallery-filter');

      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-gallery-cat') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. MODAL LIGHTBOX INTERATIVO (VÍDEO / FOTO / ORÇAMENTO DIRETO)
   ========================================================================== */
function initGalleryModal() {
  const overlay = document.getElementById('galleryModalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');

  const closeModal = () => {
    if (overlay) overlay.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

// Função Global chamada pelos cards para abrir o modal
window.openGalleryModal = function(cat, title, desc, imgUrl, specs, categoryTag) {
  const overlay = document.getElementById('galleryModalOverlay');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDescription');
  const modalSpecs = document.getElementById('modalSpecsSummary');
  const modalCategory = document.getElementById('modalServiceCategory');
  const modalWhatsapp = document.getElementById('modalWhatsappBtn');

  if (modalImg) modalImg.src = imgUrl;
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;
  if (modalSpecs) modalSpecs.textContent = specs;
  if (modalCategory) modalCategory.textContent = categoryTag || 'Especialidade J.M. Construtora';

  if (modalWhatsapp) {
    const phoneNumber = '5511976816103';
    const textMsg = encodeURIComponent(`Olá, equipe J.M. Construtora! Vi no site a obra "${title}" e gostaria de solicitar um orçamento para um serviço similar na minha propriedade.`);
    modalWhatsapp.href = `https://wa.me/${phoneNumber}?text=${textMsg}`;
  }

  if (overlay) {
    overlay.classList.add('active');
  }
};

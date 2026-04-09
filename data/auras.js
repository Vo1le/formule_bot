// ═══════════════════════════════════════════════════════════════════════
// FORMULES MPI — 1ère et 2ème année
// Domaines : Algèbre linéaire, Analyse, Probabilités, Physique,
//            Électronique, Informatique, Logique
// ═══════════════════════════════════════════════════════════════════════

export const AURAS = [

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║                        COMMUN                                   ║
  // ╚══════════════════════════════════════════════════════════════════╝

  {
    id: "taylor",
    name: "Taylor",
    rarity: "Commun", emoji: "📐", color: 0x78909C,
    chance: 8, sellPrice: 50, chapter: "Analyse — DL",
    latex: "e^x = \\sum_{n=0}^{+\\infty} \\frac{x^n}{n!}",
    display: "eˣ = Σ xⁿ/n!  (n ≥ 0)",
    description: "Série entière de l'exponentielle, archétype des DL.",
    frames: ["📐","∑","📐∑","∑📐"],
  },
  {
    id: "geometric_series",
    name: "Série Géométrique",
    rarity: "Commun", emoji: "🔢", color: 0x90A4AE,
    chance: 10, sellPrice: 40, chapter: "Séries numériques",
    latex: "\\sum_{k=0}^{n-1} r^k = \\frac{1 - r^n}{1 - r}, \\quad r \\neq 1",
    display: "Σ rᵏ (k=0→n-1) = (1−rⁿ)/(1−r)",
    description: "Somme d'une suite géométrique, base de tout calcul de série.",
    frames: ["🔢","∑","🔢∑","∑🔢"],
  },
  {
    id: "leibniz",
    name: "Leibniz",
    rarity: "Commun", emoji: "✏️", color: 0xB0BEC5,
    chance: 12, sellPrice: 35, chapter: "Calcul différentiel",
    latex: "(fg)^{(n)} = \\sum_{k=0}^{n} \\binom{n}{k} f^{(k)} g^{(n-k)}",
    display: "(fg)⁽ⁿ⁾ = Σ C(n,k)·f⁽ᵏ⁾·g⁽ⁿ⁻ᵏ⁾",
    description: "Formule de Leibniz — dérivée nième d'un produit.",
    frames: ["✏️","∂","✏️∂","∂✏️"],
  },
  {
    id: "al_kashi",
    name: "Al-Kashi",
    rarity: "Commun", emoji: "📏", color: 0xA5D6A7,
    chance: 10, sellPrice: 50, chapter: "Géométrie",
    latex: "c^2 = a^2 + b^2 - 2ab\\cos\\gamma",
    display: "c² = a² + b² − 2ab·cos(γ)",
    description: "Généralisation de Pythagore dans tout triangle.",
    frames: ["📏","△","📏△","△📏"],
  },
  {
    id: "bernoulli_ineg",
    name: "Inégalité de Bernoulli",
    rarity: "Commun", emoji: "📊", color: 0xCE93D8,
    chance: 12, sellPrice: 30, chapter: "Analyse — Inégalités",
    latex: "(1+x)^n \\geq 1 + nx, \\quad \\forall x \\geq -1,\\; n \\in \\mathbb{N}",
    display: "(1+x)ⁿ ≥ 1 + nx  ∀x ≥ −1",
    description: "Inégalité de Bernoulli — minoration classique.",
    frames: ["📊","≥","📊≥","≥📊"],
  },
  {
    id: "pont_diviseur_tension",
    name: "Pont Diviseur",
    rarity: "Commun", emoji: "🔌", color: 0xFFCC80,
    chance: 9, sellPrice: 45, chapter: "Électronique — Circuits",
    latex: "U_2 = U_1 \\cdot \\frac{R_2}{R_1 + R_2}",
    display: "U₂ = U₁ · R₂/(R₁+R₂)",
    description: "Pont diviseur de tension — loi des nœuds et mailles.",
    frames: ["🔌","U","🔌U","U₂/U₁"],
  },
  {
    id: "noyau_injectivite",
    name: "Noyau ↔ Injectivité",
    rarity: "Commun", emoji: "🔍", color: 0x80DEEA,
    chance: 9, sellPrice: 55, chapter: "Algèbre linéaire",
    latex: "f \\text{ injective} \\iff \\ker(f) = \\{0_E\\}",
    display: "f injective  ⟺  ker(f) = {0}",
    description: "CNS d'injectivité : noyau réduit au vecteur nul.",
    frames: ["🔍","ker","🔍ker","ker={0}"],
  },
  {
    id: "rang_noyau",
    name: "Théorème du Rang",
    rarity: "Commun", emoji: "📉", color: 0xA5D6A7,
    chance: 9, sellPrice: 55, chapter: "Algèbre linéaire",
    latex: "\\dim E = \\dim \\ker f + \\mathrm{rg}(f)",
    display: "dim E = dim ker(f) + rg(f)",
    description: "Théorème rang-noyau : fondement de la dimension.",
    frames: ["📉","dim","📉dim","dim=ker+rg"],
  },

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║                       PEU COMMUN                                ║
  // ╚══════════════════════════════════════════════════════════════════╝

  {
    id: "cauchy_schwarz",
    name: "Cauchy-Schwarz",
    rarity: "Peu Commun", emoji: "⚡", color: 0x66BB6A,
    chance: 45, sellPrice: 200, chapter: "Algèbre linéaire — Espaces pré-hilbertiens",
    latex: "|\\langle u, v \\rangle|^2 \\leq \\|u\\|^2 \\|v\\|^2",
    display: "|⟨u,v⟩|² ≤ ‖u‖²·‖v‖²",
    description: "Inégalité fondamentale dans tout espace pré-hilbertien.",
    frames: ["⚡","⟨⟩","⚡⟨⟩","‖u‖‖v‖"],
  },
  {
    id: "green_riemann",
    name: "Green-Riemann",
    rarity: "Peu Commun", emoji: "🌀", color: 0x29B6F6,
    chance: 55, sellPrice: 180, chapter: "Analyse — Intégration sur les domaines",
    latex: "\\oint_{\\partial D} P\\,dx + Q\\,dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dxdy",
    display: "∮∂D Pdx+Qdy = ∬D (∂Q/∂x − ∂P/∂y)dxdy",
    description: "Formule de Green-Riemann — contour et domaine.",
    frames: ["🌀","∮","🌀∮","∮→∬"],
  },
  {
    id: "diagonalisation",
    name: "Diagonalisation",
    rarity: "Peu Commun", emoji: "🔷", color: 0xFFA726,
    chance: 60, sellPrice: 220, chapter: "Algèbre linéaire — Réduction",
    latex: "A = P D P^{-1} \\implies A^n = P D^n P^{-1}",
    display: "A = PDP⁻¹  ⟹  Aⁿ = PDⁿP⁻¹",
    description: "Diagonalisation et calcul de puissances de matrices.",
    frames: ["🔷","⊗","🔷⊗","PDP⁻¹"],
  },
  {
    id: "somme_directe",
    name: "Somme Directe",
    rarity: "Peu Commun", emoji: "➕", color: 0xFF8A65,
    chance: 50, sellPrice: 240, chapter: "Algèbre linéaire — Sous-espaces",
    latex: "E = F \\oplus G \\iff E = F + G \\text{ et } F \\cap G = \\{0\\}",
    display: "E = F⊕G  ⟺  E = F+G  et  F∩G = {0}",
    description: "CNS de somme directe : supplémentarité des sous-espaces.",
    frames: ["➕","⊕","➕⊕","F⊕G"],
  },
  {
    id: "projecteur",
    name: "Projecteur",
    rarity: "Peu Commun", emoji: "🎯", color: 0xBA68C8,
    chance: 55, sellPrice: 260, chapter: "Algèbre linéaire — Endomorphismes",
    latex: "p \\text{ projecteur} \\iff p^2 = p \\iff E = \\ker p \\oplus \\mathrm{Im}\\, p",
    display: "p projecteur  ⟺  p² = p  ⟺  E = ker(p) ⊕ Im(p)",
    description: "CNS du projecteur : idempotence et décomposition de l'espace.",
    frames: ["🎯","p²=p","🎯p²","ker⊕Im"],
  },
  {
    id: "symetrie",
    name: "Symétrie",
    rarity: "Peu Commun", emoji: "🪞", color: 0x4DD0E1,
    chance: 55, sellPrice: 250, chapter: "Algèbre linéaire — Endomorphismes",
    latex: "s \\text{ symétrie} \\iff s^2 = \\mathrm{id} \\iff \\mathrm{Sp}(s) \\subset \\{-1, 1\\}",
    display: "s symétrie  ⟺  s² = id  ⟺  Sp(s) ⊂ {−1, 1}",
    description: "CNS de la symétrie : involution et valeurs propres ±1.",
    frames: ["🪞","s²=id","🪞s²","{±1}"],
  },
  {
    id: "convolution",
    name: "Convolution",
    rarity: "Peu Commun", emoji: "🔄", color: 0xEF5350,
    chance: 70, sellPrice: 160, chapter: "Probabilités — Loi des sommes",
    latex: "(f * g)(x) = \\int_{-\\infty}^{+\\infty} f(t)\\,g(x-t)\\,dt",
    display: "(f★g)(x) = ∫f(t)·g(x−t)dt",
    description: "Produit de convolution — loi de la somme de VA indépendantes.",
    frames: ["🔄","★","🔄★","∫f·g"],
  },
  {
    id: "master_theorem",
    name: "Master Theorem",
    rarity: "Peu Commun", emoji: "💻", color: 0x26C6DA,
    chance: 65, sellPrice: 250, chapter: "Informatique — Complexité",
    latex: "T(n) = aT(n/b) + f(n) \\implies T(n) = \\Theta\\!\\left(n^{\\log_b a}\\right)",
    display: "T(n) = aT(n/b) + f(n)  ⟹  Θ(n^{log_b a})",
    description: "Théorème maître — analyse des algorithmes diviser-régner.",
    frames: ["💻","Θ","💻Θ","T(n/b)"],
  },
  {
    id: "bijection",
    name: "Caractérisation Bijection",
    rarity: "Peu Commun", emoji: "↔️", color: 0x80CBC4,
    chance: 50, sellPrice: 230, chapter: "Algèbre linéaire",
    latex: "f \\text{ bij.} \\iff f \\text{ inj. et surj.} \\iff \\ker f=\\{0\\} \\text{ et } \\mathrm{Im}\\,f = F",
    display: "f bij.  ⟺  ker(f)={0}  et  Im(f)=F",
    description: "CNS de bijectivité pour une application linéaire.",
    frames: ["↔️","⟺","↔️⟺","ker={0}"],
  },
  {
    id: "fonction_transfert",
    name: "Fonction de Transfert",
    rarity: "Peu Commun", emoji: "📡", color: 0xFFB74D,
    chance: 60, sellPrice: 210, chapter: "Électronique — Systèmes linéaires",
    latex: "H(j\\omega) = \\frac{S(j\\omega)}{E(j\\omega)} = |H|\\,e^{j\\varphi(\\omega)}",
    display: "H(jω) = S(jω)/E(jω) = |H|·e^{jφ(ω)}",
    description: "Fonction de transfert en régime harmonique — module et phase.",
    frames: ["📡","H(jω)","📡H","S/E"],
  },

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║                          RARE                                   ║
  // ╚══════════════════════════════════════════════════════════════════╝

  {
    id: "fourier",
    name: "Série de Fourier",
    rarity: "Rare", emoji: "🌊", color: 0x1E88E5,
    chance: 250, sellPrice: 900, chapter: "Analyse — Fourier",
    latex: "f(x) = \\sum_{n=-\\infty}^{+\\infty} c_n e^{inx},\\quad c_n = \\frac{1}{2\\pi}\\int_0^{2\\pi}\\!f(t)e^{-int}dt",
    display: "f(x) = Σ cₙeⁱⁿˣ  ,  cₙ = (1/2π)∫f·e⁻ⁱⁿᵗdt",
    description: "Décomposition en série de Fourier d'une fonction périodique.",
    frames: ["🌊","∑∫","🌊∑","cₙeⁱⁿˣ","🌊"],
  },
  {
    id: "stokes",
    name: "Stokes",
    rarity: "Rare", emoji: "🌪️", color: 0x7E57C2,
    chance: 350, sellPrice: 1100, chapter: "Physique — Analyse vectorielle",
    latex: "\\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_{\\partial S} \\mathbf{F} \\cdot d\\ell",
    display: "∬S (∇×F)·dS = ∮∂S F·dℓ",
    description: "Théorème de Stokes — généralisation de Green-Riemann à 3D.",
    frames: ["🌪️","∇×","🌪️∮","∬∮","🌪️"],
  },
  {
    id: "cayley_hamilton",
    name: "Cayley-Hamilton",
    rarity: "Rare", emoji: "🏛️", color: 0xEC407A,
    chance: 400, sellPrice: 1300, chapter: "Algèbre linéaire — Polynôme caractéristique",
    latex: "\\chi_A(A) = 0,\\quad \\chi_A(\\lambda) = \\det(A - \\lambda I)",
    display: "χ_A(A) = 0  ,  χ_A(λ) = det(A−λI)",
    description: "Toute matrice est racine de son polynôme caractéristique.",
    frames: ["🏛️","det","🏛️χ","χ(A)=0","🏛️"],
  },
  {
    id: "stirling",
    name: "Stirling",
    rarity: "Rare", emoji: "🎭", color: 0xF57C00,
    chance: 500, sellPrice: 1600, chapter: "Dénombrement — Asymptotique",
    latex: "n! \\sim \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n",
    display: "n! ~ √(2πn)·(n/e)ⁿ",
    description: "Formule de Stirling — approximation asymptotique de n!",
    frames: ["🎭","n!","🎭√","(n/e)ⁿ","🎭"],
  },
  {
    id: "vandermonde",
    name: "Vandermonde",
    rarity: "Rare", emoji: "🏗️", color: 0x00897B,
    chance: 300, sellPrice: 1200, chapter: "Algèbre linéaire — Déterminants",
    latex: "V(x_1,\\ldots,x_n) = \\prod_{1 \\le i < j \\le n}(x_j - x_i)",
    display: "V(x₁,…,xₙ) = ∏_{i<j} (xⱼ − xᵢ)",
    description: "Déterminant de Vandermonde — clé des interpolations et du rang.",
    frames: ["🏗️","∏","🏗️∏","V(x)","∏(xⱼ−xᵢ)","🏗️"],
  },
  {
    id: "pdf_normale",
    name: "Densité Gaussienne",
    rarity: "Rare", emoji: "🔔", color: 0x5C6BC0,
    chance: 350, sellPrice: 1000, chapter: "Probabilités — Lois continues",
    latex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)",
    display: "f(x) = (1/σ√2π)·exp(−(x−μ)²/2σ²)",
    description: "PDF de la loi normale N(μ,σ²) — loi centrale en probabilités.",
    frames: ["🔔","f(x)","🔔f","exp(−x²)","1/σ√2π","🔔"],
  },
  {
    id: "acceleration_spherique",
    name: "Accélération Sphérique",
    rarity: "Rare", emoji: "🌍", color: 0x26A69A,
    chance: 400, sellPrice: 1400, chapter: "Physique — Mécanique",
    latex: "\\ddot{\\mathbf{r}} = (\\ddot{r}-r\\dot{\\theta}^2-r\\sin^2\\!\\theta\\,\\dot{\\varphi}^2)\\,\\mathbf{e}_r + (r\\ddot{\\theta}+2\\dot{r}\\dot{\\theta}-r\\sin\\theta\\cos\\theta\\,\\dot{\\varphi}^2)\\,\\mathbf{e}_\\theta + (r\\sin\\theta\\,\\ddot{\\varphi}+2\\dot{r}\\sin\\theta\\,\\dot{\\varphi}+2r\\dot{\\theta}\\cos\\theta\\,\\dot{\\varphi})\\,\\mathbf{e}_\\varphi",
    display: "a = (r̈−rθ̇²−r sin²θ φ̇²)eᵣ + (rθ̈+2ṙθ̇−r sinθ cosθ φ̇²)eθ + (r sinθ φ̈+…)eφ",
    description: "Accélération en coordonnées sphériques (r, θ, φ).",
    frames: ["🌍","eᵣ","🌍eθ","aᵣ+aθ+aφ","🌍∇"],
  },
  {
    id: "hermite_decomp",
    name: "Décomposition Hermite",
    rarity: "Rare", emoji: "🔮", color: 0xAB47BC,
    chance: 450, sellPrice: 1100, chapter: "Algèbre linéaire — Formes quadratiques (2A)",
    latex: "q(x) = \\sum_{i=1}^r \\lambda_i x_i^2,\\quad \\text{signature}=(p,q)",
    display: "q(x) = Σ λᵢxᵢ²  ,  signature = (p,q)",
    description: "Réduction de Hermite : forme normale d'une forme quadratique.",
    frames: ["🔮","q(x)","🔮Σλ","λᵢxᵢ²","🔮"],
  },

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║                         ÉPIQUE                                  ║
  // ╚══════════════════════════════════════════════════════════════════╝

  {
    id: "jordan",
    name: "Jordan",
    rarity: "Épique", emoji: "👁️", color: 0xAB47BC,
    chance: 2500, sellPrice: 6000, chapter: "Algèbre linéaire — Réduction (2A)",
    latex: "A = P J P^{-1},\\quad J = \\mathrm{diag}\\bigl(J_{n_1}(\\lambda_1),\\ldots,J_{n_k}(\\lambda_k)\\bigr)",
    display: "A = PJP⁻¹  ,  J = diag(J_{n₁}(λ₁),…,J_{nₖ}(λₖ))",
    description: "Forme de Jordan — forme canonique de tout endomorphisme.",
    frames: ["👁️","J","👁️J","PJP⁻¹","Jₙ(λ)","👁️"],
  },
  {
    id: "residus",
    name: "Théorème des Résidus",
    rarity: "Épique", emoji: "🌌", color: 0x5C6BC0,
    chance: 3000, sellPrice: 7000, chapter: "Analyse complexe (2A)",
    latex: "\\oint_\\gamma f(z)\\,dz = 2\\pi i \\sum_{k} \\mathrm{Res}(f, a_k)",
    display: "∮γ f(z)dz = 2πi · Σₖ Res(f, aₖ)",
    description: "Théorème des résidus de Cauchy — calcul d'intégrales complexes.",
    frames: ["🌌","∮","🌌∮","2πi","Res(f,a)","🌌"],
  },
  {
    id: "laplace_transform",
    name: "Transformée de Laplace",
    rarity: "Épique", emoji: "⚗️", color: 0x00ACC1,
    chance: 4000, sellPrice: 9000, chapter: "EDO — Systèmes (2A)",
    latex: "\\mathcal{L}\\{f\\}(s) = \\int_0^{+\\infty} f(t)\\,e^{-st}\\,dt",
    display: "ℒ{f}(s) = ∫₀^{+∞} f(t)·e⁻ˢᵗ dt",
    description: "Transformée de Laplace — outil majeur pour les EDO et circuits.",
    frames: ["⚗️","ℒ","⚗️ℒ","∫e⁻ˢᵗ","ℒ{f}","⚗️"],
  },
  {
    id: "sylvester",
    name: "Inertie de Sylvester",
    rarity: "Épique", emoji: "⚖️", color: 0xF06292,
    chance: 3500, sellPrice: 8000, chapter: "Algèbre — Formes quadratiques (2A)",
    latex: "\\text{sig}(q) = (p, r-p) \\text{ invariante par changement de base}",
    display: "sig(q) = (p, r−p) invariante par changement de base",
    description: "Théorème de Sylvester : la signature d'une forme quadratique est un invariant.",
    frames: ["⚖️","sig","⚖️(p,q)","invariant","⚖️"],
  },
  {
    id: "fredholm",
    name: "Alternative de Fredholm",
    rarity: "Épique", emoji: "🔱", color: 0xEF5350,
    chance: 4500, sellPrice: 10000, chapter: "Algèbre linéaire (2A)",
    latex: "Ax = b \\text{ a une solution} \\iff b \\in (\\ker A^T)^\\perp",
    display: "Ax=b a une sol.  ⟺  b ⊥ ker(Aᵀ)",
    description: "Alternative de Fredholm — existence des solutions d'un système.",
    frames: ["🔱","⊥","🔱Ax=b","ker Aᵀ","🔱⊥"],
  },
  {
    id: "gram_schmidt",
    name: "Gram-Schmidt",
    rarity: "Épique", emoji: "🧮", color: 0x7986CB,
    chance: 2800, sellPrice: 6500, chapter: "Algèbre linéaire — Espaces euclidiens (2A)",
    latex: "e_k = \\frac{v_k - \\sum_{i<k}\\langle v_k,e_i\\rangle e_i}{\\left\\|v_k - \\sum_{i<k}\\langle v_k,e_i\\rangle e_i\\right\\|}",
    display: "eₖ = (vₖ − Σᵢ₍ₖ₎⟨vₖ,eᵢ⟩eᵢ) / ‖…‖",
    description: "Procédé d'orthonormalisation de Gram-Schmidt.",
    frames: ["🧮","⟨,⟩","🧮e₁","orthonorm.","🧮‖‖"],
  },

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║                       LÉGENDAIRE                                ║
  // ╚══════════════════════════════════════════════════════════════════╝

  {
    id: "riemann_zeta",
    name: "Riemann ζ",
    rarity: "Légendaire", emoji: "⭐", color: 0xFFD700,
    chance: 10000, sellPrice: 30000, chapter: "Analyse — Théorie des nombres (2A)",
    latex: "\\zeta(s) = \\sum_{n=1}^{\\infty}\\frac{1}{n^s} = \\prod_p \\frac{1}{1-p^{-s}}",
    display: "ζ(s) = Σ 1/nˢ = ∏ₚ 1/(1−p⁻ˢ)",
    description: "Fonction zêta et produit eulérien — lien analyse/arithmétique.",
    frames: ["⭐","ζ","⭐ζ","∑1/nˢ","∏ₚ","⭐∑∏","ζ(s)","⭐"],
  },
  {
    id: "navier_stokes",
    name: "Navier-Stokes",
    rarity: "Légendaire", emoji: "🌊", color: 0x0D47A1,
    chance: 15000, sellPrice: 45000, chapter: "Physique — Mécanique des fluides (2A)",
    latex: "\\rho\\Bigl(\\frac{\\partial\\mathbf{u}}{\\partial t}+(\\mathbf{u}\\cdot\\nabla)\\mathbf{u}\\Bigr)=-\\nabla p+\\mu\\Delta\\mathbf{u}+\\mathbf{f}",
    display: "ρ(∂u/∂t + (u·∇)u) = −∇p + μΔu + f",
    description: "Équation de Navier-Stokes — un des problèmes du millénaire.",
    frames: ["🌊","∇","🌊∇","ρ∂u/∂t","∇p+μΔu","🌊ρ∇Δ","Navier","🌊"],
  },
  {
    id: "spectral_theorem",
    name: "Théorème Spectral",
    rarity: "Légendaire", emoji: "🌈", color: 0x6A1B9A,
    chance: 12000, sellPrice: 35000, chapter: "Algèbre linéaire — Endomorphismes symétriques (2A)",
    latex: "A \\in \\mathcal{S}_n(\\mathbb{R}) \\implies \\exists P \\in O_n(\\mathbb{R}),\\; A = P D P^T,\\; D \\in \\mathcal{D}_n(\\mathbb{R})",
    display: "A symétrique réelle  ⟹  A = PDPᵀ  ,  P orthogonale",
    description: "Théorème spectral — toute matrice symétrique est diagonalisable en base ON.",
    frames: ["🌈","Sp","🌈Sp","PDPᵀ","Oₙ(ℝ)","🌈diag","spectral","🌈"],
  },
  {
    id: "bernstein_poly",
    name: "Bernstein",
    rarity: "Légendaire", emoji: "🌺", color: 0xAD1457,
    chance: 18000, sellPrice: 55000, chapter: "Analyse — Approximation (2A)",
    latex: "B_n[f](x)=\\sum_{k=0}^n f\\!\\left(\\tfrac{k}{n}\\right)\\binom{n}{k}x^k(1-x)^{n-k}\\xrightarrow{n\\to\\infty} f(x)",
    display: "Bₙ[f](x) = Σ f(k/n)·C(n,k)·xᵏ(1−x)^{n−k} → f(x)",
    description: "Polynômes de Bernstein — preuve constructive du théorème de Weierstrass.",
    frames: ["🌺","Bₙ","🌺Bₙf","→f(x)","Weierstrass","🌺∑","🌺"],
  },

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║                          SECRET                                 ║
  // ╚══════════════════════════════════════════════════════════════════╝

  {
    id: "grothendieck",
    name: "Grothendieck",
    rarity: "Secret", emoji: "🌀", color: 0x1A237E,
    chance: 100000, sellPrice: 250000, chapter: "Algèbre homologique",
    latex: "0 \\to A \\xrightarrow{f} B \\xrightarrow{g} C \\to 0",
    display: "0 → A →f B →g C → 0  (suite exacte courte)",
    description: "☆ Suite exacte courte — cœur de l'algèbre homologique. ☆",
    frames: ["🌀","→","🌀→","0→A→B","→C→0","🌀exacte","A→B→C","🌀"],
  },
  {
    id: "godel",
    name: "Gödel",
    rarity: "Secret", emoji: "♾️", color: 0x0A0A0A,
    chance: 250000, sellPrice: 600000, chapter: "Logique & Informatique théorique",
    latex: "\\forall T\\text{ cohérente r.é.}:\\exists\\varphi,\\;T\\nvdash\\varphi\\;\\text{ et }\\;T\\nvdash\\neg\\varphi",
    display: "∀T cohérente r.é. : ∃φ  T⊬φ  et  T⊬¬φ",
    description: "☆ Théorème d'incomplétude de Gödel — limite fondamentale des formalismes. ☆",
    frames: ["♾️","⊬","♾️⊬","∀T∃φ","T⊬φ","⊬¬φ","♾️Gödel","♾️"],
  },
];

// ── Méta-données raretés ─────────────────────────────────────────────
export const RARITY_META = {
  "Commun":     { stars:"⚪", glow:"░", color:0x9E9E9E },
  "Peu Commun": { stars:"🟢", glow:"▒", color:0x4CAF50 },
  "Rare":       { stars:"🔵", glow:"▓", color:0x2196F3 },
  "Épique":     { stars:"🟣", glow:"█", color:0x9C27B0 },
  "Légendaire": { stars:"🟡", glow:"★", color:0xFFD700 },
  "Secret":     { stars:"⚡", glow:"☆", color:0xFF1744 },
};

// ── Cases ────────────────────────────────────────────────────────────
export const CASES = {
  basic: {
    id:"basic", name:"Case Basique", emoji:"📦",
    price:100, color:0x607D8B,
    description:"Toutes les formules MPI. Chances classiques.",
  },
  premium: {
    id:"premium", name:"Case Prépa", emoji:"📚",
    price:500, color:0x9C27B0,
    description:"Commun −50%, Rare+ boostés. Pour les bons étudiants.",
    rarityBoost:{ "Commun":0.5,"Peu Commun":1.0,"Rare":2.0,"Épique":3.0,"Légendaire":4.0,"Secret":5.0 },
  },
  legendary: {
    id:"legendary", name:"Case Normalien", emoji:"🎓",
    price:2000, color:0xFFD700,
    description:"Rare minimum garanti. Légendaire/Secret très boostés.",
    minRarity:"Rare",
    rarityBoost:{ "Commun":0,"Peu Commun":0,"Rare":3.0,"Épique":6.0,"Légendaire":10.0,"Secret":15.0 },
  },
};

// ── URL LaTeX image (codecogs, fond noir pour Discord dark mode) ──────
export function latexImageUrl(latex) {
  const encoded = encodeURIComponent(latex);
  return `https://latex.codecogs.com/png.image?\\dpi{150}\\bg{black}\\color{white}${encoded}`;
}

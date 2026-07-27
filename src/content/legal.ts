export type LegalLocale = "pt" | "en" | "es" | "fr" | "it";

type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type LegalDocument = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
};

type LegalContent = {
  rules: LegalDocument;
  privacy: LegalDocument;
};

const pt: LegalContent = {
  rules: {
    metaTitle: "Regulamento — Peregrinação de Nossa Senhora da Cristandade",
    metaDescription: "Regras de participação na Peregrinação de Nossa Senhora da Cristandade — Portugal 2026.",
    eyebrow: "Participação",
    title: "Regulamento da Peregrinação",
    subtitle: "Regras para uma peregrinação segura, ordeira e vivida em espírito de fé.",
    updated: "Última atualização: 26 de julho de 2026",
    sections: [
      {
        title: "1. Objeto e organização",
        paragraphs: [
          "O presente regulamento estabelece as condições de participação na Peregrinação de Nossa Senhora da Cristandade — Portugal, entre a Nazaré e Fátima, nos dias 10, 11 e 12 de outubro de 2026.",
          "A peregrinação é uma iniciativa católica de oração e penitência, organizada por leigos com o apoio do Instituto São Nuno de Santa Maria. Não é uma prova desportiva nem uma atividade turística.",
        ],
      },
      {
        title: "2. Inscrição e participação",
        items: [
          "A participação exige inscrição válida, aceitação deste regulamento e pagamento do valor aplicável.",
          "A inscrição só se considera confirmada depois da confirmação do pagamento, salvo nos casos expressamente isentos.",
          "Os dados fornecidos devem ser verdadeiros, completos e atuais. A inscrição é pessoal e não pode ser cedida sem autorização da organização.",
          "Menores participam sob a responsabilidade de um adulto e podem ter de apresentar autorização do encarregado de educação.",
          "A organização pode recusar ou cancelar uma inscrição quando existam dados falsos, incumprimento grave deste regulamento ou risco para o próprio ou para terceiros.",
        ],
      },
      {
        title: "3. Saúde e preparação",
        items: [
          "Cada peregrino é responsável por avaliar se a sua condição física e de saúde é compatível com o percurso escolhido e por procurar aconselhamento médico quando necessário.",
          "A organização deve ser informada, no formulário, de alergias, necessidades especiais ou condições relevantes para uma assistência de emergência.",
          "Cada participante deve levar a medicação pessoal, água, alimentação complementar e o equipamento indicado pela organização.",
          "A equipa de apoio presta primeiros socorros dentro dos meios disponíveis; situações urgentes serão encaminhadas para os serviços de emergência.",
        ],
      },
      {
        title: "4. Conduta durante a peregrinação",
        items: [
          "Os participantes devem respeitar o caráter religioso da peregrinação, os momentos de oração e silêncio, os locais de culto e as demais pessoas.",
          "Devem ser cumpridas as indicações dos chefes de capítulo, responsáveis de coluna, segurança, assistência e organização.",
          "É proibido consumir drogas, apresentar-se embriagado, transportar armas ou adotar comportamentos violentos, perigosos, discriminatórios ou gravemente perturbadores.",
          "Cada peregrino deve respeitar o percurso sinalizado, os horários, as regras rodoviárias, o ambiente e os bens públicos e privados.",
          "A organização pode afastar quem coloque em risco a segurança, perturbe gravemente a peregrinação ou desobedeça reiteradamente às instruções.",
        ],
      },
      {
        title: "5. Percurso, bagagem e serviços",
        items: [
          "O programa, percurso, horários, locais de Missa, dormida, refeições e transporte podem ser alterados por razões pastorais, meteorológicas, logísticas, de segurança ou de força maior.",
          "A bagagem deve respeitar as dimensões, identificação e limites comunicados pela organização. Objetos de valor permanecem à responsabilidade do participante.",
          "Dormidas e transportes dependem da opção inscrita e da disponibilidade posteriormente confirmada pela organização.",
          "O participante responde pelos danos que cause culposamente a pessoas, instalações, veículos ou equipamento.",
        ],
      },
      {
        title: "6. Pagamentos, cancelamentos e alterações",
        items: [
          "Os preços e serviços incluídos são os apresentados no resumo da inscrição antes do pagamento.",
          "Pedidos de correção ou cancelamento devem ser enviados, com a referência da inscrição, para infonscportugal@gmail.com.",
          "Eventuais reembolsos dependem dos serviços já contratados ou prestados, dos custos não recuperáveis suportados pela organização e dos direitos imperativos do consumidor aplicáveis.",
          "Se a organização cancelar integralmente a peregrinação, comunicará aos inscritos as opções disponíveis, incluindo o reembolso dos montantes relativos a serviços não prestados, sem prejuízo da lei aplicável.",
          "Alterações razoáveis ao programa que preservem a realização da peregrinação não conferem, por si só, direito a reembolso integral.",
        ],
      },
      {
        title: "7. Imagem e comunicações",
        paragraphs: [
          "A autorização para utilização de imagem é opcional e separada da aceitação deste regulamento. Pode ser retirada para utilizações futuras através do contacto da organização, sem afetar materiais já legitimamente publicados.",
          "A organização pode enviar comunicações essenciais sobre a inscrição, pagamento, segurança, alterações ao programa e informações práticas.",
        ],
      },
      {
        title: "8. Responsabilidade e aceitação",
        paragraphs: [
          "A organização adotará medidas razoáveis de segurança e assistência, sem excluir ou limitar responsabilidades que legalmente não possam ser excluídas. Não responde por perdas resultantes de desrespeito das instruções, informação omitida, objetos pessoais ou acontecimentos inevitáveis fora do seu controlo.",
          "Ao concluir a inscrição, o participante declara ter lido, compreendido e aceite este regulamento. Questões podem ser enviadas para infonscportugal@gmail.com.",
        ],
      },
    ],
  },
  privacy: {
    metaTitle: "Política de Privacidade — Peregrinação de Nossa Senhora da Cristandade",
    metaDescription: "Como tratamos os dados pessoais dos participantes, nos termos do RGPD.",
    eyebrow: "Proteção de dados",
    title: "Política de Privacidade",
    subtitle: "Informação transparente sobre a recolha e utilização dos seus dados pessoais.",
    updated: "Última atualização: 26 de julho de 2026",
    sections: [
      {
        title: "1. Responsável pelo tratamento",
        paragraphs: [
          "A organização da Peregrinação de Nossa Senhora da Cristandade — Portugal, iniciativa apoiada pelo Instituto São Nuno de Santa Maria, é responsável pelo tratamento dos dados pessoais recolhidos neste site.",
          "Para questões de privacidade ou para exercer os seus direitos, contacte infonscportugal@gmail.com.",
        ],
      },
      {
        title: "2. Dados que recolhemos",
        items: [
          "Identificação e contacto: nome, apelido, correio eletrónico, telefone, nacionalidade e data de nascimento.",
          "Dados da participação: estado de vida, afiliação, tipo de percurso, capítulo, familiares inscritos, dormidas e transporte.",
          "Dados de segurança: contacto de emergência, alergias, necessidades especiais e informação de saúde que decida comunicar.",
          "Dados da transação: referência, estado, valor e identificadores técnicos do pagamento. Não armazenamos os dados completos do cartão.",
          "Dados técnicos essenciais ao funcionamento e à segurança do site e medições agregadas de utilização.",
        ],
      },
      {
        title: "3. Finalidades e fundamentos",
        items: [
          "Gerir a inscrição, os serviços solicitados, o pagamento e as comunicações necessárias — execução do contrato e diligências pré-contratuais.",
          "Organizar grupos, percurso, dormidas, transporte, assistência e resposta a emergências — execução do serviço, interesses vitais e, quando aplicável, consentimento explícito para dados de saúde.",
          "Cumprir obrigações contabilísticas, fiscais, legais e pedidos legítimos das autoridades — obrigação legal.",
          "Proteger o site, prevenir fraude e produzir estatísticas agregadas — interesse legítimo na segurança e melhoria do serviço.",
          "Publicar imagens identificáveis para divulgação — apenas quando tenha dado autorização, que é facultativa e pode ser retirada para o futuro.",
        ],
      },
      {
        title: "4. Partilha e prestadores",
        paragraphs: [
          "Os dados são acessíveis apenas à equipa e voluntários que deles necessitem e a prestadores sujeitos a deveres de confidencialidade. Podemos recorrer à Stripe para pagamentos, a fornecedores de alojamento e base de dados para operar o site, e a prestadores de correio eletrónico, bilhetes e suporte técnico.",
          "Partilhamos apenas o necessário para cada finalidade. Também poderemos comunicar dados quando a lei o imponha, para proteger interesses vitais ou para exercer e defender direitos.",
        ],
      },
      {
        title: "5. Transferências internacionais",
        paragraphs: [
          "Alguns prestadores podem tratar dados fora do Espaço Económico Europeu. Nesses casos serão usados os mecanismos legalmente exigidos, como decisões de adequação ou cláusulas contratuais-tipo, e salvaguardas complementares quando necessárias.",
        ],
      },
      {
        title: "6. Conservação",
        paragraphs: [
          "Conservamos os dados da inscrição durante o tempo necessário para organizar e concluir a peregrinação, resolver pedidos e cumprir os prazos legais aplicáveis. Dados contabilísticos e de transações são mantidos pelo período exigido por lei. Dados de saúde e emergência deixam de ser necessários após o evento e serão eliminados ou anonimizados tão cedo quanto seja razoavelmente possível, salvo obrigação legal ou litígio.",
        ],
      },
      {
        title: "7. Os seus direitos",
        items: [
          "Pode pedir acesso, retificação, apagamento, limitação ou portabilidade dos seus dados e opor-se a tratamentos baseados em interesse legítimo.",
          "Pode retirar o consentimento a qualquer momento, sem afetar a licitude do tratamento anterior.",
          "O exercício de alguns direitos pode ser limitado por obrigações legais ou pela necessidade de executar a inscrição.",
          "Pode reclamar junto da Comissão Nacional de Proteção de Dados (CNPD), em www.cnpd.pt.",
        ],
      },
      {
        title: "8. Segurança, cookies e alterações",
        paragraphs: [
          "Aplicamos medidas técnicas e organizativas adequadas ao risco. Nenhum sistema é absolutamente seguro, pelo que deve contactar-nos se suspeitar de utilização indevida dos seus dados.",
          "O site utiliza apenas tecnologias necessárias ao funcionamento, segurança, preferências de idioma e pagamento, além de métricas agregadas. Se forem introduzidas tecnologias que exijam consentimento, será apresentado o respetivo mecanismo de escolha.",
          "Esta política pode ser atualizada para refletir alterações legais ou operacionais. A versão vigente e a data da última atualização estarão sempre publicadas nesta página.",
        ],
      },
    ],
  },
};

const en: LegalContent = {
  rules: {
    metaTitle: "Regulations — Pilgrimage of Our Lady of Christendom",
    metaDescription: "Rules for participating in the Pilgrimage of Our Lady of Christendom — Portugal 2026.",
    eyebrow: "Participation",
    title: "Pilgrimage Regulations",
    subtitle: "Rules for a safe and orderly pilgrimage lived in a spirit of faith.",
    updated: "Last updated: 26 July 2026",
    sections: [
      { title: "1. Purpose and organisation", paragraphs: ["These regulations set out the conditions for taking part in the Pilgrimage of Our Lady of Christendom — Portugal, from Nazaré to Fátima, on 10, 11 and 12 October 2026.", "The pilgrimage is a Catholic initiative of prayer and penance, organised by laypeople with the support of the São Nuno de Santa Maria Institute. It is neither a sporting event nor a tourist activity."] },
      { title: "2. Registration and participation", items: ["Participation requires a valid registration, acceptance of these regulations and payment of the applicable amount.", "Registration is only confirmed once payment has been confirmed, except in expressly exempt cases.", "Information supplied must be true, complete and current. Registration is personal and may not be transferred without the organisation's permission.", "Minors take part under an adult's responsibility and may be required to provide authorisation from a parent or guardian.", "The organisation may refuse or cancel a registration where information is false, these rules are seriously breached, or there is a risk to the participant or others."] },
      { title: "3. Health and preparation", items: ["Each pilgrim is responsible for assessing whether their health and fitness are compatible with the chosen route and for seeking medical advice where necessary.", "The organisation must be told in the form about allergies, special needs or conditions relevant to emergency assistance.", "Each participant must bring personal medication, water, supplementary food and the equipment indicated by the organisation.", "The support team provides first aid within its available means; urgent cases will be referred to emergency services."] },
      { title: "4. Conduct during the pilgrimage", items: ["Participants must respect the pilgrimage's religious nature, periods of prayer and silence, places of worship and other people.", "Instructions from chapter leaders and column, safety, assistance and organisation staff must be followed.", "Drugs, intoxication, weapons, and violent, dangerous, discriminatory or seriously disruptive behaviour are prohibited.", "Each pilgrim must respect the marked route, timetable, road rules, the environment, and public and private property.", "The organisation may remove anyone who endangers safety, seriously disrupts the pilgrimage or repeatedly disobeys instructions."] },
      { title: "5. Route, luggage and services", items: ["The programme, route, timetable and Mass, accommodation, meal and transport locations may change for pastoral, weather, logistical, safety or force majeure reasons.", "Luggage must comply with the dimensions, identification and limits communicated by the organisation. Valuables remain the participant's responsibility.", "Accommodation and transport depend on the registered option and availability subsequently confirmed by the organisation.", "Participants are responsible for damage they culpably cause to people, premises, vehicles or equipment."] },
      { title: "6. Payments, cancellations and changes", items: ["Prices and included services are those shown in the registration summary before payment.", "Correction or cancellation requests must be sent with the registration reference to infonscportugal@gmail.com.", "Any refund depends on services already contracted or provided, non-recoverable costs borne by the organisation, and applicable mandatory consumer rights.", "If the organisation cancels the entire pilgrimage, it will inform registrants of the available options, including reimbursement of amounts for services not provided, without prejudice to applicable law.", "Reasonable programme changes that preserve the pilgrimage do not, by themselves, create a right to a full refund."] },
      { title: "7. Image and communications", paragraphs: ["Permission to use a participant's image is optional and separate from acceptance of these regulations. It may be withdrawn for future uses by contacting the organisation, without affecting material already lawfully published.", "The organisation may send essential communications about registration, payment, safety, programme changes and practical information."] },
      { title: "8. Liability and acceptance", paragraphs: ["The organisation will take reasonable safety and assistance measures, without excluding or limiting liability that cannot legally be excluded. It is not responsible for losses caused by disregarding instructions, omitted information, personal belongings or unavoidable events outside its control.", "By completing registration, participants declare that they have read, understood and accepted these regulations. Questions may be sent to infonscportugal@gmail.com."] },
    ],
  },
  privacy: {
    metaTitle: "Privacy Policy — Pilgrimage of Our Lady of Christendom",
    metaDescription: "How we process participants' personal data under the GDPR.",
    eyebrow: "Data protection",
    title: "Privacy Policy",
    subtitle: "Clear information about how we collect and use your personal data.",
    updated: "Last updated: 26 July 2026",
    sections: [
      { title: "1. Data controller", paragraphs: ["The organisation of the Pilgrimage of Our Lady of Christendom — Portugal, an initiative supported by the São Nuno de Santa Maria Institute, is responsible for processing personal data collected on this website.", "For privacy questions or to exercise your rights, contact infonscportugal@gmail.com."] },
      { title: "2. Data we collect", items: ["Identity and contact details: first and last name, email, telephone, nationality and date of birth.", "Participation data: state of life, affiliation, route type, chapter, registered family members, accommodation and transport.", "Safety data: emergency contact, allergies, special needs and health information you choose to provide.", "Transaction data: reference, status, amount and technical payment identifiers. We do not store full card details.", "Technical data essential to the website's operation and security, and aggregated usage measurements."] },
      { title: "3. Purposes and legal bases", items: ["Managing registration, requested services, payment and necessary communications — performance of a contract and pre-contractual steps.", "Organising groups, route, accommodation, transport, assistance and emergency response — performance of the service, vital interests and, where applicable, explicit consent for health data.", "Meeting accounting, tax and legal obligations and lawful authority requests — legal obligation.", "Protecting the website, preventing fraud and producing aggregated statistics — legitimate interests in security and service improvement.", "Publishing identifiable images for publicity — only where optional permission has been given; it may be withdrawn for future uses."] },
      { title: "4. Sharing and service providers", paragraphs: ["Data is available only to team members and volunteers who need it and to providers bound by confidentiality duties. We may use Stripe for payments, hosting and database providers to operate the website, and email, ticketing and technical support providers.", "We share only what is necessary for each purpose. We may also disclose data where required by law, to protect vital interests, or to establish and defend legal rights."] },
      { title: "5. International transfers", paragraphs: ["Some providers may process data outside the European Economic Area. Where they do, legally required mechanisms such as adequacy decisions or standard contractual clauses, and supplementary safeguards where necessary, will be used."] },
      { title: "6. Retention", paragraphs: ["We retain registration data for as long as needed to organise and complete the pilgrimage, handle requests and meet applicable legal periods. Accounting and transaction data is retained for the period required by law. Health and emergency data ceases to be needed after the event and will be deleted or anonymised as soon as reasonably possible, unless required for a legal claim or obligation."] },
      { title: "7. Your rights", items: ["You may request access, correction, deletion, restriction or portability of your data and object to processing based on legitimate interests.", "You may withdraw consent at any time, without affecting earlier lawful processing.", "Some rights may be limited by legal obligations or the need to perform your registration.", "You may complain to the Portuguese Data Protection Authority (CNPD) at www.cnpd.pt."] },
      { title: "8. Security, cookies and changes", paragraphs: ["We apply technical and organisational measures appropriate to the risk. No system is completely secure, so please contact us if you suspect misuse of your data.", "The website uses only technologies needed for operation, security, language preferences and payment, plus aggregated metrics. If technologies requiring consent are introduced, an appropriate choice mechanism will be provided.", "This policy may be updated for legal or operational changes. The current version and its update date will always be published here."] },
    ],
  },
};

const es: LegalContent = {
  rules: {
    metaTitle: "Reglamento — Peregrinación de Nuestra Señora de la Cristiandad",
    metaDescription: "Normas de participación en la Peregrinación de Nuestra Señora de la Cristiandad — Portugal 2026.",
    eyebrow: "Participación", title: "Reglamento de la Peregrinación", subtitle: "Normas para una peregrinación segura, ordenada y vivida con espíritu de fe.", updated: "Última actualización: 26 de julio de 2026",
    sections: [
      { title: "1. Objeto y organización", paragraphs: ["Este reglamento establece las condiciones de participación en la Peregrinación de Nuestra Señora de la Cristiandad — Portugal, de Nazaré a Fátima, los días 10, 11 y 12 de octubre de 2026.", "La peregrinación es una iniciativa católica de oración y penitencia, organizada por laicos con el apoyo del Instituto São Nuno de Santa Maria. No es una prueba deportiva ni una actividad turística."] },
      { title: "2. Inscripción y participación", items: ["La participación exige una inscripción válida, la aceptación de este reglamento y el pago del importe aplicable.", "La inscripción solo queda confirmada tras confirmarse el pago, salvo casos expresamente exentos.", "Los datos facilitados deben ser verdaderos, completos y actuales. La inscripción es personal y no puede cederse sin autorización.", "Los menores participan bajo la responsabilidad de un adulto y podrá exigirse autorización de sus padres o tutores.", "La organización puede rechazar o cancelar una inscripción por datos falsos, incumplimiento grave o riesgo para el participante o terceros."] },
      { title: "3. Salud y preparación", items: ["Cada peregrino debe valorar si su salud y condición física son compatibles con el recorrido y consultar a un médico cuando sea necesario.", "Deben comunicarse en el formulario las alergias, necesidades especiales o condiciones relevantes para una emergencia.", "Cada participante debe llevar su medicación, agua, alimentación complementaria y el equipo indicado.", "El equipo de apoyo presta primeros auxilios con los medios disponibles; los casos urgentes serán derivados a emergencias."] },
      { title: "4. Conducta", items: ["Debe respetarse el carácter religioso, los momentos de oración y silencio, los lugares de culto y a las demás personas.", "Deben seguirse las indicaciones de los responsables de capítulo, columna, seguridad, asistencia y organización.", "Se prohíben las drogas, la embriaguez, las armas y las conductas violentas, peligrosas, discriminatorias o gravemente perturbadoras.", "Cada peregrino debe respetar el recorrido, horarios, normas viales, medio ambiente y bienes públicos y privados.", "La organización puede apartar a quien ponga en riesgo la seguridad, perturbe gravemente o desobedezca reiteradamente."] },
      { title: "5. Recorrido, equipaje y servicios", items: ["El programa, recorrido, horarios y lugares de Misa, alojamiento, comidas y transporte pueden cambiar por razones pastorales, meteorológicas, logísticas, de seguridad o fuerza mayor.", "El equipaje debe respetar las dimensiones, identificación y límites comunicados. Los objetos de valor quedan bajo responsabilidad del participante.", "El alojamiento y transporte dependen de la opción inscrita y de la disponibilidad posteriormente confirmada.", "El participante responde de los daños que cause culpablemente a personas, instalaciones, vehículos o equipos."] },
      { title: "6. Pagos, cancelaciones y cambios", items: ["Los precios y servicios incluidos son los mostrados en el resumen antes del pago.", "Las solicitudes de corrección o cancelación, con la referencia, deben enviarse a infonscportugal@gmail.com.", "Todo reembolso depende de los servicios ya contratados o prestados, de los costes no recuperables y de los derechos imperativos del consumidor aplicables.", "Si la organización cancela íntegramente la peregrinación, comunicará las opciones, incluido el reembolso de servicios no prestados, sin perjuicio de la ley aplicable.", "Los cambios razonables que permitan mantener la peregrinación no generan por sí solos derecho a reembolso íntegro."] },
      { title: "7. Imagen y comunicaciones", paragraphs: ["La autorización de imagen es opcional y separada de este reglamento. Puede retirarse para usos futuros, sin afectar a material ya publicado lícitamente.", "La organización puede enviar comunicaciones esenciales sobre inscripción, pago, seguridad, cambios e información práctica."] },
      { title: "8. Responsabilidad y aceptación", paragraphs: ["La organización adoptará medidas razonables de seguridad y asistencia, sin excluir responsabilidades que legalmente no puedan excluirse. No responde de pérdidas por incumplir instrucciones, omitir información, objetos personales o hechos inevitables fuera de su control.", "Al inscribirse, el participante declara haber leído, comprendido y aceptado este reglamento. Consultas: infonscportugal@gmail.com."] },
    ],
  },
  privacy: {
    metaTitle: "Política de Privacidad — Peregrinación de Nuestra Señora de la Cristiandad", metaDescription: "Cómo tratamos los datos personales de los participantes conforme al RGPD.", eyebrow: "Protección de datos", title: "Política de Privacidad", subtitle: "Información clara sobre la recogida y el uso de sus datos personales.", updated: "Última actualización: 26 de julio de 2026",
    sections: [
      { title: "1. Responsable del tratamiento", paragraphs: ["La organización de la Peregrinación de Nuestra Señora de la Cristiandad — Portugal, iniciativa apoyada por el Instituto São Nuno de Santa Maria, es responsable de los datos recogidos en este sitio.", "Para consultas de privacidad o ejercer sus derechos: infonscportugal@gmail.com."] },
      { title: "2. Datos recogidos", items: ["Identificación y contacto: nombre, apellidos, correo, teléfono, nacionalidad y fecha de nacimiento.", "Participación: estado de vida, afiliación, recorrido, capítulo, familiares, alojamiento y transporte.", "Seguridad: contacto de emergencia, alergias, necesidades especiales e información de salud que decida facilitar.", "Transacción: referencia, estado, importe e identificadores técnicos. No almacenamos los datos completos de la tarjeta.", "Datos técnicos esenciales para el funcionamiento y seguridad y métricas agregadas."] },
      { title: "3. Finalidades y bases jurídicas", items: ["Gestionar inscripción, servicios, pago y comunicaciones necesarias — ejecución contractual y medidas precontractuales.", "Organizar grupos, recorrido, alojamiento, transporte, asistencia y emergencias — ejecución del servicio, intereses vitales y, cuando proceda, consentimiento explícito para salud.", "Cumplir obligaciones contables, fiscales, legales y requerimientos legítimos — obligación legal.", "Proteger el sitio, prevenir fraude y elaborar estadísticas agregadas — interés legítimo.", "Publicar imágenes identificables — solo con autorización opcional, revocable para el futuro."] },
      { title: "4. Destinatarios y proveedores", paragraphs: ["Solo acceden el equipo y voluntarios que lo necesiten y proveedores sujetos a confidencialidad. Podemos utilizar Stripe para pagos, proveedores de alojamiento y base de datos, y servicios de correo, entradas y soporte técnico.", "Solo compartimos lo necesario; también cuando lo exija la ley, para proteger intereses vitales o defender derechos."] },
      { title: "5. Transferencias internacionales", paragraphs: ["Si un proveedor trata datos fuera del EEE, se utilizarán los mecanismos legales exigidos, como decisiones de adecuación o cláusulas contractuales tipo, y garantías adicionales cuando sean necesarias."] },
      { title: "6. Conservación", paragraphs: ["Conservamos los datos mientras sean necesarios para organizar y cerrar la peregrinación, atender solicitudes y cumplir plazos legales. Los datos contables se guardan durante el plazo legal. Los datos de salud y emergencia se eliminarán o anonimizarán tan pronto como sea razonable tras el evento, salvo obligación legal o litigio."] },
      { title: "7. Sus derechos", items: ["Puede solicitar acceso, rectificación, supresión, limitación o portabilidad y oponerse al tratamiento basado en interés legítimo.", "Puede retirar su consentimiento en cualquier momento, sin afectar al tratamiento anterior.", "Algunos derechos pueden limitarse por obligaciones legales o para ejecutar la inscripción.", "Puede reclamar ante la CNPD portuguesa en www.cnpd.pt."] },
      { title: "8. Seguridad, cookies y cambios", paragraphs: ["Aplicamos medidas adecuadas al riesgo. Ningún sistema es totalmente seguro; contáctenos si sospecha un uso indebido.", "El sitio usa tecnologías necesarias para funcionamiento, seguridad, idioma y pago, además de métricas agregadas. Si se introducen tecnologías que requieran consentimiento, se ofrecerá un mecanismo de elección.", "Esta política puede actualizarse. La versión vigente y su fecha estarán siempre publicadas aquí."] },
    ],
  },
};

const fr: LegalContent = {
  rules: {
    metaTitle: "Règlement — Pèlerinage de Notre-Dame de la Chrétienté", metaDescription: "Règles de participation au Pèlerinage de Notre-Dame de la Chrétienté — Portugal 2026.", eyebrow: "Participation", title: "Règlement du Pèlerinage", subtitle: "Des règles pour un pèlerinage sûr, ordonné et vécu dans un esprit de foi.", updated: "Dernière mise à jour : 26 juillet 2026",
    sections: [
      { title: "1. Objet et organisation", paragraphs: ["Ce règlement fixe les conditions de participation au Pèlerinage de Notre-Dame de la Chrétienté — Portugal, de Nazaré à Fátima, les 10, 11 et 12 octobre 2026.", "Le pèlerinage est une initiative catholique de prière et de pénitence, organisée par des laïcs avec le soutien de l'Institut São Nuno de Santa Maria. Ce n'est ni une compétition sportive ni une activité touristique."] },
      { title: "2. Inscription et participation", items: ["La participation exige une inscription valide, l'acceptation du présent règlement et le paiement du montant applicable.", "L'inscription n'est confirmée qu'après confirmation du paiement, sauf exemption expresse.", "Les informations doivent être exactes, complètes et à jour. L'inscription est personnelle et incessible sans autorisation.", "Les mineurs participent sous la responsabilité d'un adulte et une autorisation parentale peut être exigée.", "L'organisation peut refuser ou annuler une inscription en cas de fausses données, de violation grave ou de risque pour la personne ou autrui."] },
      { title: "3. Santé et préparation", items: ["Chaque pèlerin doit vérifier que sa santé et sa condition physique sont compatibles avec le parcours et demander un avis médical si nécessaire.", "Les allergies, besoins particuliers ou problèmes utiles aux secours doivent être signalés dans le formulaire.", "Chaque participant apporte ses médicaments, de l'eau, un complément alimentaire et l'équipement indiqué.", "L'équipe d'assistance fournit les premiers secours avec les moyens disponibles ; les urgences seront confiées aux services compétents."] },
      { title: "4. Comportement", items: ["Le caractère religieux, les temps de prière et de silence, les lieux de culte et les autres personnes doivent être respectés.", "Les instructions des chefs de chapitre et des responsables de colonne, sécurité, assistance et organisation doivent être suivies.", "Drogues, ivresse, armes et comportements violents, dangereux, discriminatoires ou gravement perturbateurs sont interdits.", "Le parcours, les horaires, le code de la route, l'environnement et les biens publics et privés doivent être respectés.", "L'organisation peut écarter toute personne mettant la sécurité en danger, perturbant gravement ou désobéissant de façon répétée."] },
      { title: "5. Parcours, bagages et services", items: ["Programme, parcours, horaires et lieux de Messe, hébergement, repas et transport peuvent changer pour des raisons pastorales, météorologiques, logistiques, de sécurité ou de force majeure.", "Les bagages doivent respecter les dimensions, l'identification et les limites communiquées. Les objets de valeur restent sous la responsabilité du participant.", "Hébergement et transport dépendent de l'option inscrite et de la disponibilité confirmée ultérieurement.", "Le participant répond des dommages qu'il cause fautivement aux personnes, locaux, véhicules ou équipements."] },
      { title: "6. Paiements, annulations et modifications", items: ["Les prix et services inclus sont ceux affichés dans le récapitulatif avant paiement.", "Les demandes de correction ou d'annulation, avec la référence, doivent être adressées à infonscportugal@gmail.com.", "Tout remboursement dépend des services déjà engagés ou fournis, des frais irrécupérables et des droits impératifs du consommateur applicables.", "En cas d'annulation totale par l'organisation, les options seront communiquées, dont le remboursement des services non fournis, sous réserve de la loi.", "Les modifications raisonnables permettant le maintien du pèlerinage n'ouvrent pas, à elles seules, droit à un remboursement intégral."] },
      { title: "7. Image et communications", paragraphs: ["L'autorisation d'image est facultative et distincte du règlement. Elle peut être retirée pour l'avenir sans affecter les contenus déjà licitement publiés.", "L'organisation peut envoyer les communications essentielles relatives à l'inscription, au paiement, à la sécurité, aux changements et aux informations pratiques."] },
      { title: "8. Responsabilité et acceptation", paragraphs: ["L'organisation prend des mesures raisonnables de sécurité et d'assistance sans exclure les responsabilités légalement incompressibles. Elle ne répond pas des pertes dues au non-respect des consignes, aux informations omises, aux effets personnels ou aux événements inévitables hors de son contrôle.", "En s'inscrivant, le participant déclare avoir lu, compris et accepté ce règlement. Questions : infonscportugal@gmail.com."] },
    ],
  },
  privacy: {
    metaTitle: "Politique de confidentialité — Pèlerinage de Notre-Dame de la Chrétienté", metaDescription: "Notre traitement des données personnelles des participants conformément au RGPD.", eyebrow: "Protection des données", title: "Politique de confidentialité", subtitle: "Des informations claires sur la collecte et l'utilisation de vos données personnelles.", updated: "Dernière mise à jour : 26 juillet 2026",
    sections: [
      { title: "1. Responsable du traitement", paragraphs: ["L'organisation du Pèlerinage de Notre-Dame de la Chrétienté — Portugal, initiative soutenue par l'Institut São Nuno de Santa Maria, est responsable des données recueillies sur ce site.", "Pour toute question ou pour exercer vos droits : infonscportugal@gmail.com."] },
      { title: "2. Données collectées", items: ["Identité et contact : nom, prénom, courriel, téléphone, nationalité et date de naissance.", "Participation : état de vie, affiliation, parcours, chapitre, famille inscrite, hébergement et transport.", "Sécurité : contact d'urgence, allergies, besoins particuliers et informations de santé que vous choisissez de fournir.", "Transaction : référence, statut, montant et identifiants techniques. Nous ne stockons pas les données complètes de carte.", "Données techniques nécessaires au fonctionnement et à la sécurité, et mesures agrégées."] },
      { title: "3. Finalités et bases juridiques", items: ["Gérer inscription, services, paiement et communications nécessaires — contrat et mesures précontractuelles.", "Organiser groupes, parcours, hébergement, transport, assistance et urgences — exécution du service, intérêts vitaux et, le cas échéant, consentement explicite pour la santé.", "Respecter les obligations comptables, fiscales, légales et demandes légitimes — obligation légale.", "Protéger le site, prévenir la fraude et établir des statistiques agrégées — intérêt légitime.", "Publier des images identifiables — seulement avec une autorisation facultative, révocable pour l'avenir."] },
      { title: "4. Destinataires et prestataires", paragraphs: ["Seuls l'équipe, les bénévoles qui en ont besoin et les prestataires soumis à la confidentialité y accèdent. Nous pouvons utiliser Stripe pour les paiements, des hébergeurs et bases de données, et des services de courriel, billetterie et support.", "Nous ne partageons que le nécessaire, ou lorsque la loi l'exige, pour protéger des intérêts vitaux ou défendre des droits."] },
      { title: "5. Transferts internationaux", paragraphs: ["Si un prestataire traite des données hors EEE, les mécanismes requis seront utilisés : décision d'adéquation ou clauses contractuelles types, avec des garanties supplémentaires si nécessaire."] },
      { title: "6. Conservation", paragraphs: ["Les données sont conservées le temps d'organiser et clôturer le pèlerinage, répondre aux demandes et respecter les délais légaux. Les données comptables suivent la durée légale. Les données de santé et d'urgence seront supprimées ou anonymisées dès que raisonnablement possible après l'événement, sauf obligation ou litige."] },
      { title: "7. Vos droits", items: ["Vous pouvez demander accès, rectification, effacement, limitation ou portabilité et vous opposer aux traitements fondés sur l'intérêt légitime.", "Vous pouvez retirer votre consentement à tout moment, sans affecter le traitement antérieur.", "Certains droits peuvent être limités par la loi ou l'exécution de l'inscription.", "Vous pouvez saisir l'autorité portugaise CNPD sur www.cnpd.pt."] },
      { title: "8. Sécurité, cookies et modifications", paragraphs: ["Nous appliquons des mesures adaptées au risque. Aucun système n'est totalement sûr ; contactez-nous en cas de soupçon d'usage abusif.", "Le site utilise les technologies nécessaires au fonctionnement, à la sécurité, à la langue et au paiement, ainsi que des mesures agrégées. Un choix sera proposé si un consentement devient nécessaire.", "Cette politique peut être actualisée. Sa version en vigueur et sa date resteront publiées ici."] },
    ],
  },
};

const it: LegalContent = {
  rules: {
    metaTitle: "Regolamento — Pellegrinaggio di Nostra Signora della Cristianità", metaDescription: "Regole di partecipazione al Pellegrinaggio di Nostra Signora della Cristianità — Portogallo 2026.", eyebrow: "Partecipazione", title: "Regolamento del Pellegrinaggio", subtitle: "Regole per un pellegrinaggio sicuro, ordinato e vissuto con spirito di fede.", updated: "Ultimo aggiornamento: 26 luglio 2026",
    sections: [
      { title: "1. Oggetto e organizzazione", paragraphs: ["Il presente regolamento stabilisce le condizioni di partecipazione al Pellegrinaggio di Nostra Signora della Cristianità — Portogallo, da Nazaré a Fátima, il 10, 11 e 12 ottobre 2026.", "Il pellegrinaggio è un'iniziativa cattolica di preghiera e penitenza, organizzata da laici con il sostegno dell'Istituto São Nuno de Santa Maria. Non è una competizione sportiva né un'attività turistica."] },
      { title: "2. Iscrizione e partecipazione", items: ["La partecipazione richiede un'iscrizione valida, l'accettazione del regolamento e il pagamento dell'importo applicabile.", "L'iscrizione è confermata solo dopo la conferma del pagamento, salvo esenzioni espresse.", "I dati devono essere veritieri, completi e aggiornati. L'iscrizione è personale e non cedibile senza autorizzazione.", "I minori partecipano sotto la responsabilità di un adulto e può essere richiesta l'autorizzazione del genitore o tutore.", "L'organizzazione può rifiutare o annullare l'iscrizione per dati falsi, grave violazione o rischio per il partecipante o terzi."] },
      { title: "3. Salute e preparazione", items: ["Ogni pellegrino deve valutare la compatibilità della propria salute e forma fisica con il percorso e consultare un medico se necessario.", "Nel modulo vanno indicate allergie, esigenze speciali o condizioni rilevanti per un'emergenza.", "Ogni partecipante porta farmaci personali, acqua, alimenti integrativi e l'attrezzatura indicata.", "La squadra di supporto presta primo soccorso con i mezzi disponibili; le urgenze saranno affidate ai servizi di emergenza."] },
      { title: "4. Condotta", items: ["Vanno rispettati il carattere religioso, i momenti di preghiera e silenzio, i luoghi di culto e le altre persone.", "Vanno seguite le indicazioni dei responsabili di capitolo, colonna, sicurezza, assistenza e organizzazione.", "Sono vietati droghe, ubriachezza, armi e comportamenti violenti, pericolosi, discriminatori o gravemente molesti.", "Ogni pellegrino deve rispettare percorso, orari, norme stradali, ambiente e beni pubblici e privati.", "L'organizzazione può allontanare chi mette a rischio la sicurezza, disturba gravemente o disobbedisce ripetutamente."] },
      { title: "5. Percorso, bagagli e servizi", items: ["Programma, percorso, orari e luoghi di Messa, pernottamento, pasti e trasporto possono cambiare per motivi pastorali, meteorologici, logistici, di sicurezza o forza maggiore.", "I bagagli devono rispettare dimensioni, identificazione e limiti comunicati. Gli oggetti di valore restano sotto la responsabilità del partecipante.", "Pernottamento e trasporto dipendono dall'opzione scelta e dalla disponibilità successivamente confermata.", "Il partecipante risponde dei danni colposamente causati a persone, strutture, veicoli o attrezzature."] },
      { title: "6. Pagamenti, annullamenti e modifiche", items: ["Prezzi e servizi inclusi sono quelli mostrati nel riepilogo prima del pagamento.", "Le richieste di correzione o annullamento, con riferimento, vanno inviate a infonscportugal@gmail.com.", "Ogni rimborso dipende dai servizi già contrattati o forniti, dai costi non recuperabili e dai diritti inderogabili del consumatore.", "Se l'organizzazione annulla l'intero pellegrinaggio, comunicherà le opzioni disponibili, incluso il rimborso dei servizi non forniti, nel rispetto della legge.", "Modifiche ragionevoli che consentano lo svolgimento non danno, da sole, diritto al rimborso integrale."] },
      { title: "7. Immagine e comunicazioni", paragraphs: ["L'autorizzazione all'immagine è facoltativa e separata dal regolamento. Può essere ritirata per usi futuri senza incidere su materiale già lecitamente pubblicato.", "L'organizzazione può inviare comunicazioni essenziali su iscrizione, pagamento, sicurezza, cambiamenti e informazioni pratiche."] },
      { title: "8. Responsabilità e accettazione", paragraphs: ["L'organizzazione adotta ragionevoli misure di sicurezza e assistenza senza escludere responsabilità inderogabili. Non risponde di perdite dovute al mancato rispetto delle istruzioni, informazioni omesse, beni personali o eventi inevitabili fuori controllo.", "Con l'iscrizione il partecipante dichiara di aver letto, compreso e accettato il regolamento. Domande: infonscportugal@gmail.com."] },
    ],
  },
  privacy: {
    metaTitle: "Politica sulla privacy — Pellegrinaggio di Nostra Signora della Cristianità", metaDescription: "Come trattiamo i dati personali dei partecipanti ai sensi del GDPR.", eyebrow: "Protezione dei dati", title: "Politica sulla privacy", subtitle: "Informazioni chiare sulla raccolta e sull'uso dei dati personali.", updated: "Ultimo aggiornamento: 26 luglio 2026",
    sections: [
      { title: "1. Titolare del trattamento", paragraphs: ["L'organizzazione del Pellegrinaggio di Nostra Signora della Cristianità — Portogallo, iniziativa sostenuta dall'Istituto São Nuno de Santa Maria, è titolare dei dati raccolti su questo sito.", "Per domande o per esercitare i diritti: infonscportugal@gmail.com."] },
      { title: "2. Dati raccolti", items: ["Identità e contatti: nome, cognome, email, telefono, nazionalità e data di nascita.", "Partecipazione: stato di vita, affiliazione, percorso, capitolo, familiari, pernottamento e trasporto.", "Sicurezza: contatto di emergenza, allergie, esigenze speciali e dati sanitari che si sceglie di fornire.", "Transazione: riferimento, stato, importo e identificativi tecnici. Non conserviamo i dati completi della carta.", "Dati tecnici necessari a funzionamento e sicurezza e misurazioni aggregate."] },
      { title: "3. Finalità e basi giuridiche", items: ["Gestire iscrizione, servizi, pagamento e comunicazioni necessarie — contratto e misure precontrattuali.", "Organizzare gruppi, percorso, pernottamento, trasporto, assistenza ed emergenze — servizio, interessi vitali e, ove applicabile, consenso esplicito per dati sanitari.", "Adempiere a obblighi contabili, fiscali, legali e richieste legittime — obbligo legale.", "Proteggere il sito, prevenire frodi e produrre statistiche aggregate — legittimo interesse.", "Pubblicare immagini identificabili — solo con autorizzazione facoltativa, revocabile per il futuro."] },
      { title: "4. Destinatari e fornitori", paragraphs: ["Accedono solo squadra e volontari che ne hanno bisogno e fornitori vincolati alla riservatezza. Possiamo usare Stripe per i pagamenti, fornitori di hosting e database e servizi di email, biglietteria e supporto tecnico.", "Condividiamo solo il necessario, oppure quanto imposto dalla legge, per proteggere interessi vitali o difendere diritti."] },
      { title: "5. Trasferimenti internazionali", paragraphs: ["Se un fornitore tratta dati fuori dal SEE, saranno usati i meccanismi richiesti, come decisioni di adeguatezza o clausole contrattuali standard, con garanzie aggiuntive se necessarie."] },
      { title: "6. Conservazione", paragraphs: ["Conserviamo i dati per organizzare e concludere il pellegrinaggio, gestire richieste e rispettare i termini legali. I dati contabili seguono il periodo di legge. I dati sanitari e di emergenza saranno eliminati o anonimizzati appena ragionevolmente possibile dopo l'evento, salvo obblighi o contenziosi."] },
      { title: "7. Diritti", items: ["È possibile chiedere accesso, rettifica, cancellazione, limitazione o portabilità e opporsi ai trattamenti basati sul legittimo interesse.", "Il consenso può essere revocato in ogni momento senza incidere sul trattamento precedente.", "Alcuni diritti possono essere limitati da obblighi legali o dalla necessità di eseguire l'iscrizione.", "È possibile reclamare presso l'autorità portoghese CNPD su www.cnpd.pt."] },
      { title: "8. Sicurezza, cookie e modifiche", paragraphs: ["Applichiamo misure adeguate al rischio. Nessun sistema è totalmente sicuro; contattateci in caso di sospetto uso improprio.", "Il sito usa tecnologie necessarie per funzionamento, sicurezza, lingua e pagamento, oltre a metriche aggregate. Se saranno introdotte tecnologie soggette a consenso, verrà offerta una scelta.", "La politica può essere aggiornata. Versione vigente e data resteranno pubblicate qui."] },
    ],
  },
};

export const legalContent: Record<LegalLocale, LegalContent> = { pt, en, es, fr, it };

export function getLegalContent(locale: string): LegalContent {
  return legalContent[locale as LegalLocale] ?? legalContent.pt;
}

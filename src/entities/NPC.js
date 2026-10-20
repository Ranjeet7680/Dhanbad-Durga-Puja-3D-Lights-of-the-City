import * as THREE from 'three';

export class NPCManager {
  constructor(scene, engine) {
    this.scene = scene;
    this.engine = engine;
    this.npcs = [];

    this.initAuthoredNPCs();
  }

  initAuthoredNPCs() {
    const definitions = [
      {
        id: 'npc_aheli',
        name: 'Aheli (अहेली)',
        role: 'Festival Documentation Volunteer',
        roleHi: 'उत्सव प्रलेखन स्वयंसेवक',
        emoji: '👧',
        clothingColor: 0x00897B, // Teal Kurti & Volunteer Sash
        position: new THREE.Vector3(3.5, 0, 4.5),
        rotation: -Math.PI / 4,
        dialogueTree: {
          intro: {
            text: "Shubho Sharodiya! Welcome to Dhanbad! Every year, our city transforms with dazzling pandals, vibrant melas, and heartwarming community spirit. I'm documenting the stories of our 5 festival lanterns. Here is your official Pandal Passport!",
            textHi: "शुभ शारदीया! धनबाद की दुर्गा पूजा में आपका स्वागत है! हर साल हमारा कोयलांचल इन भव्य पंडालों और रोशनी से जगमगा उठता है। मैं यहाँ के पाँच दीपकों की कहानियों का दस्तावेजीकरण कर रही हूँ। यह लीजिए आपका आधिकारिक पंडाल पासपोर्ट!",
            choices: [
              { label: "मुझे क्या करना होगा? (Guide me)", labelEn: "How do I complete my passport?", next: "guide" },
              { label: "हाउसिंग कॉलोनी पंडाल की क्या विशेषता है?", labelEn: "What is special about Housing Colony?", next: "housing_info" }
            ]
          },
          guide: {
            text: "Explore each district! Walk north through the illuminated Light Tunnel to visit the Housing Colony Pandal, head east to the Mega Mela for fair rides, and visit Madan da at the Jharudih craft lane.",
            textHi: "उत्सव के प्रत्येक क्षेत्र का भ्रमण करें! उत्तर की ओर जगमगाती लाइट टनल से होते हुए हाउसिंग कॉलोनी पंडाल जाएं, पूर्व में मेगा मेला है और पश्चिम में मदन दा की शिल्प वाटिका।",
            choices: [
              { label: "मैं भ्रमण के लिए तैयार हूँ! [स्वीकार करें]", labelEn: "I'm ready to explore! [Accept]", action: "accept_welcome_quest" }
            ]
          },
          housing_info: {
            text: "Housing Colony creates one of the grandest pandals in Jharkhand! Their artisanal bamboo woodwork, fabric draping, and sparkling LED tunnel attract visitors from all over the district.",
            textHi: "हाउसिंग कॉलोनी का पंडाल पूरे झारखंड में सबसे भव्य माना जाता है! यहाँ का कारीगरी बाँस का काम, कपड़े की छतरी और रंग-बिरंगी लाइटें दूर-दूर से लोगों को आकर्षित करती हैं।",
            choices: [
              { label: "मैं अभी वहाँ जाता हूँ! [प्रारंभ]", labelEn: "I'll head there now! [Accept]", action: "accept_welcome_quest" }
            ]
          }
        }
      },
      {
        id: 'npc_madan',
        name: 'Madan da (मदन दा)',
        role: 'Pandal Craft Coordinator',
        roleHi: 'पंडाल शिल्पकला प्रभारी',
        emoji: '🧔',
        clothingColor: 0xFB8C00, // Artisan Orange Kurta
        position: new THREE.Vector3(-36, 0, 0),
        rotation: Math.PI / 2,
        dialogueTree: {
          intro: {
            text: "Arre bhai, greetings! We have been crafting this entrance for weeks with bamboo, jute, and hand-cut wood. But during the rush, 3 of our Golden Lotus ornaments got misplaced around the workshop!",
            textHi: "अरे भाई, नमस्कार! हम कई हफ़्तों से बाँस, जूट और नक्काशीदार लकड़ी से यह तोरण द्वार बना रहे हैं। पर इस भीड़-भाड़ में हमारे 3 स्वर्ण कमल के आभूषण कहीं खो गए हैं!",
            choices: [
              { label: "मैं 3 स्वर्ण कमल ढूंढने में मदद करूँगा! [कार्य लें]", labelEn: "I can help find the 3 Golden Lotuses!", next: "craft_quest" },
              { label: "पारंपरिक शिल्पकला के बारे में बताएं।", labelEn: "Tell me about traditional pandal crafting.", next: "craft_lore" }
            ]
          },
          craft_quest: {
            text: "Khub bhalo! Search around this artisan courtyard. When you find all three, bring them back and we'll light the Craft Lantern together!",
            textHi: "खूब भालो! इस शिल्प वाटिका के आसपास ढूंढिए। तीनों कमल मिलते ही हम मिलकर शिल्प दीप प्रज्ज्वलित करेंगे!",
            choices: [
              { label: "अभी ढूंढता हूँ, मदन दा!", labelEn: "On it, Madan da!", action: "start_craft_quest" }
            ]
          },
          craft_lore: {
            text: "Real pandal making is community engineering. We don't use concrete—it's pure bamboo poles, ropes, intricate handloom fabrics, and weeks of sleepless love.",
            textHi: "पंडाल निर्माण सामुदायिक कला और इंजीनियरिंग का संगम है। हम कंक्रीट नहीं, केवल बाँस, रस्सियाँ और शुद्ध श्रद्धा का उपयोग करते हैं।",
            choices: [
              { label: "कमल ढूंढने चलते हैं!", labelEn: "Let's find those ornaments!", action: "start_craft_quest" }
            ]
          }
        }
      },
      {
        id: 'npc_imran',
        name: 'Imran (इमरान)',
        role: 'Mega Mela Ride Operator',
        roleHi: 'मेगा मेला झूला संचालक',
        emoji: '🧑‍🔧',
        clothingColor: 0x1E88E5, // Blue Mechanic Vest
        position: new THREE.Vector3(49.5, 0, 8),
        rotation: -Math.PI / 2,
        dialogueTree: {
          intro: {
            text: "Bhaiya! Welcome to the Dhanbad Mega Mela! You haven't truly seen Durga Puja until you've witnessed the glowing city skyline from the top of our Giant Wheel (Jhula).",
            textHi: "भैया! धनबाद मेगा मेले में आपका स्वागत है! जब तक आपने जाइंट व्हील के शिखर से जगमगाते शहर को नहीं देखा, तब तक दुर्गा पूजा पूरी नहीं होती!",
            choices: [
              { label: "मुझे झूले में बैठना है! [सवारी करें]", labelEn: "I want to ride the Giant Wheel!", next: "ride_prompt" },
              { label: "क्या यह झूला सुरक्षित है?", labelEn: "Is the ride safe?", next: "safety" }
            ]
          },
          ride_prompt: {
            text: "Step right up onto the boarding platform! Hold on tight, take your camera out, and enjoy the night panorama!",
            textHi: "मंच पर आइए और झूले में बैठिए! ऊपर जाकर पूरा धनबाद दीपों के शहर जैसा जगमगाता दिखता है।",
            choices: [
              { label: "झूले पर सवार हों [Board Jhula]", labelEn: "Board the Jhula [Ride]", action: "start_ferris_ride" }
            ]
          },
          safety: {
            text: "100% certified! Dual steel cable locking pins, steady rotation, and our team monitors every turn. Climb aboard whenever you're ready!",
            textHi: "शत-प्रतिशत सुरक्षित है! डबल केबल लॉकिंग और सुरक्षा जांच के बाद ही हम चक्कर शुरू करते हैं। जब चाहें तब बैठिए!",
            choices: [
              { label: "सवारी शुरू करें! [Board]", labelEn: "Let's ride! [Board]", action: "start_ferris_ride" }
            ]
          }
        }
      },
      {
        id: 'npc_rupa',
        name: 'Rupa (रूपा)',
        role: 'Food Lane Coordinator',
        roleHi: 'फूड लेन संचालक',
        emoji: '👩‍🍳',
        clothingColor: 0xD81B60, // Magenta Festive Apron
        position: new THREE.Vector3(29, 0, 6),
        rotation: Math.PI / 2,
        dialogueTree: {
          intro: {
            text: "Namaste! The fragrance of fresh Bengali puchkas and hot crispy jalebis is the true heartbeat of the mela! Could you deliver a box of fresh jalebis to the volunteer information desk?",
            textHi: "नमस्ते! करारे पुचके और गरमा-गरम जलेबियों की महक ही मेले की असली जान है! क्या आप स्वयंसेवकों के सूचना केंद्र तक यह जलेबी का डिब्बा पहुंचा देंगे?",
            choices: [
              { label: "ज़रूर! स्वयंसेवकों तक मिठाई पहुँचाता हूँ।", labelEn: "Gladly! Delivering sweets to volunteers.", next: "food_quest" }
            ]
          },
          food_quest: {
            text: "You are wonderful! Take this box of piping-hot jalebis and share the festive sweetness. That's the spirit of the Community Light!",
            textHi: "बहुत-बहुत धन्यवाद! यह गरमा-गरम जलेबियों की मिठास ही हमारे समुदाय के दीप की असली पहचान है!",
            choices: [
              { label: "मिठाई पहुँचाने चलें! [स्वीकार]", labelEn: "Delivering now! [Accept]", action: "start_food_quest" }
            ]
          }
        }
      },
      {
        id: 'npc_dida',
        name: 'Dida (दीदा)',
        role: 'Keeper of Oral History',
        roleHi: 'स्मृति धरोहर संरक्षिका',
        emoji: '👵',
        clothingColor: 0xF5F5F5, // Traditional White Saree with Red Border
        position: new THREE.Vector3(0, 0, 32),
        rotation: Math.PI,
        dialogueTree: {
          intro: {
            text: "Ashirbaad, shona. I have been watching Dhanbad's Durga Puja since 1968. In those days, people walked miles across the colliery paths under petromax lanterns just to hear the dhak.",
            textHi: "आशीर्वाद, बेटा। मैं 1968 से धनबाद की दुर्गा पूजा देख रही हूँ। उस दौर में लोग पेट्रोमैक्स लालटेन की रोशनी में मीलों चलकर ढाक की आवाज़ सुनने आते थे।",
            choices: [
              { label: "दीदा, हमारी इस पूजा में क्या विशेष है?", labelEn: "Dida, what makes our puja so special?", next: "history_lore" }
            ]
          },
          history_lore: {
            text: "No matter which colliery or corner of India people come from—Bengali, Bihari, Jharkhandi, Punjabi—everyone stands together in the queue with smiles and folded hands. That unity is the Home Light of Dhanbad.",
            textHi: "चाहे कोई किसी भी खदान या प्रान्त से आया हो—बंगाली, बिहारी, झारखंडी, पंजाबी—सब एक ही कतार में हाथ जोड़कर माँ के दर्शन करते हैं। यही एकता धनबाद का असली गृह दीप है।",
            choices: [
              { label: "धन्यवाद दीदा, इस पावन स्मृति के लिए। [पूर्ण]", labelEn: "Thank you for this beautiful memory, Dida.", action: "complete_home_quest" }
            ]
          }
        }
      }
    ];

    definitions.forEach((def) => {
      this.createNPC(def);
    });
  }

  createNPC(def) {
    const group = new THREE.Group();
    group.position.copy(def.position);
    group.rotation.y = def.rotation;

    // Stylized Character Mesh
    const bodyMat = new THREE.MeshStandardMaterial({ color: def.clothingColor, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xD7A07E, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1A1412, roughness: 0.9 });

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.8, 8), bodyMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), skinMat);
    head.position.y = 1.72;
    head.castShadow = true;
    group.add(head);

    // Hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.21, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    hair.position.y = 1.76;
    group.add(hair);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.7 });
    [-0.14, 0.14].forEach((lx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.75, 0.14), legMat);
      leg.position.set(lx, 0.4, 0);
      group.add(leg);
    });

    // Floating Golden Quest Marker (!) above head
    const markerGroup = new THREE.Group();
    markerGroup.position.set(0, 2.4, 0);

    const markerMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      emissive: 0xFFA000,
      emissiveIntensity: 2.0
    });

    const markBody = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.02, 0.35, 6), markerMat);
    markBody.position.y = 0.2;
    markerGroup.add(markBody);

    const markDot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), markerMat);
    markDot.position.y = -0.06;
    markerGroup.add(markDot);

    group.add(markerGroup);

    this.scene.add(group);

    this.npcs.push({
      id: def.id,
      name: def.name,
      role: def.role,
      roleHi: def.roleHi,
      emoji: def.emoji,
      group: group,
      marker: markerGroup,
      dialogueTree: def.dialogueTree,
      interactionRadius: 3.5
    });
  }

  update(delta, time) {
    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      npc.marker.rotation.y += delta * 2;
      npc.marker.position.y = 2.4 + Math.sin(time * 3 + i) * 0.12;
    }
  }

  getNearbyNPC(playerPosition) {
    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      const dist = playerPosition.distanceTo(npc.group.position);
      if (dist <= npc.interactionRadius) {
        return { npc, distance: dist };
      }
    }
    return null;
  }
}

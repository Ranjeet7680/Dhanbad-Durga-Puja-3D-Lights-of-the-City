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
        name: 'Aheli',
        role: 'Festival Documentation Volunteer',
        emoji: '👧',
        clothingColor: 0x00897B, // Teal Kurti & Volunteer Sash
        position: new THREE.Vector3(3.5, 0, 4.5),
        rotation: -Math.PI / 4,
        dialogueTree: {
          intro: {
            text: "Shubho Sharodiya! Welcome to Dhanbad! Every year, our coalfields and neighbourhoods light up with these magnificent pandals. I'm documenting the stories of our 5 festival lanterns. Here is your official Pandal Passport!",
            choices: [
              { label: "Thank you! How do I complete my passport?", next: "guide" },
              { label: "What is special about the Housing Colony Pandal?", next: "housing_info" }
            ]
          },
          guide: {
            text: "Explore each district! Walk north through the illuminated Light Tunnel to visit the Housing Colony Pandal, head east to the Mega Mela for fair rides, and visit Madan da at the Jharudih craft lane.",
            choices: [
              { label: "I'm ready to explore!", action: "accept_welcome_quest" }
            ]
          },
          housing_info: {
            text: "Housing Colony creates one of the grandest pandals in Jharkhand! Their artisanal bamboo woodwork, fabric draping, and sparkling LED tunnel attract visitors from all over the district.",
            choices: [
              { label: "I will head there now!", action: "accept_welcome_quest" }
            ]
          }
        }
      },
      {
        id: 'npc_madan',
        name: 'Madan da',
        role: 'Pandal Craft Coordinator',
        emoji: '🧔',
        clothingColor: 0xFB8C00, // Artisan Orange Kurta
        position: new THREE.Vector3(-36, 0, 0),
        rotation: Math.PI / 2,
        dialogueTree: {
          intro: {
            text: "Arre bhai, greetings! We have been crafting this entrance for weeks with bamboo, jute, and hand-cut wood. But during the rush, 3 of our Golden Lotus ornaments got misplaced around the workshop!",
            choices: [
              { label: "I can help you find the 3 Golden Lotuses!", next: "craft_quest" },
              { label: "Tell me about traditional pandal crafting.", next: "craft_lore" }
            ]
          },
          craft_quest: {
            text: "Khub bhalo! Search around this artisan courtyard. When you find all three, bring them back and we'll light the Craft Lantern together!",
            choices: [
              { label: "On it, Madan da!", action: "start_craft_quest" }
            ]
          },
          craft_lore: {
            text: "Real pandal making is community engineering. We don't use concrete—it's pure bamboo poles, ropes, intricate handloom fabrics, and weeks of sleepless love.",
            choices: [
              { label: "Let's find those ornaments!", action: "start_craft_quest" }
            ]
          }
        }
      },
      {
        id: 'npc_imran',
        name: 'Imran',
        role: 'Mega Mela Ride Operator',
        emoji: '🧑‍🔧',
        clothingColor: 0x1E88E5, // Blue Mechanic Vest
        position: new THREE.Vector3(49.5, 0, 8),
        rotation: -Math.PI / 2,
        dialogueTree: {
          intro: {
            text: "Bhaiya! Welcome to the Dhanbad Mega Mela! You haven't truly seen Durga Puja until you've witnessed the glowing city skyline from the top of our Giant Wheel (Jhula).",
            choices: [
              { label: "I want to ride the Giant Wheel!", next: "ride_prompt" },
              { label: "Is it safe?", next: "safety" }
            ]
          },
          ride_prompt: {
            text: "Step right up onto the boarding platform! Hold on tight, take your camera out, and enjoy the night panorama!",
            choices: [
              { label: "Board the Jhula [Ride]", action: "start_ferris_ride" }
            ]
          },
          safety: {
            text: "100% certified! Dual steel cable locking pins, steady rotation, and our team monitors every turn. Climb aboard whenever you're ready!",
            choices: [
              { label: "Let's ride! [Board]", action: "start_ferris_ride" }
            ]
          }
        }
      },
      {
        id: 'npc_rupa',
        name: 'Rupa',
        role: 'Food Lane Coordinator',
        emoji: '👩‍🍳',
        clothingColor: 0xD81B60, // Magenta Festive Apron
        position: new THREE.Vector3(29, 0, 6),
        rotation: Math.PI / 2,
        dialogueTree: {
          intro: {
            text: "Namaste! The fragrance of fresh Bengali puchkas and hot crispy jalebis is the true heartbeat of the mela! Could you deliver a box of fresh jalebis to the volunteer information desk?",
            choices: [
              { label: "Gladly! Volunteers need energy.", next: "food_quest" }
            ]
          },
          food_quest: {
            text: "You are wonderful! Take this box of piping-hot jalebis and share the festive sweetness. That's the spirit of the Community Light!",
            choices: [
              { label: "Delivering now!", action: "start_food_quest" }
            ]
          }
        }
      },
      {
        id: 'npc_dida',
        name: 'Dida',
        role: 'Keeper of Oral History',
        emoji: '👵',
        clothingColor: 0xF5F5F5, // Traditional White Saree with Red Border
        position: new THREE.Vector3(0, 0, 32),
        rotation: Math.PI,
        dialogueTree: {
          intro: {
            text: "Ashirbaad, shona. I have been watching Dhanbad's Durga Puja since 1968. In those days, people walked miles across the colliery paths under petromax lanterns just to hear the dhak.",
            choices: [
              { label: "Dida, what makes our puja so special?", next: "history_lore" }
            ]
          },
          history_lore: {
            text: "No matter which colliery or corner of India people come from—Bengali, Bihari, Jharkhandi, Punjabi—everyone stands together in the queue with smiles and folded hands. That unity is the Home Light of Dhanbad.",
            choices: [
              { label: "Thank you for this beautiful memory, Dida.", action: "complete_home_quest" }
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

    // Exclamation mark body & dot
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
      emoji: def.emoji,
      group: group,
      marker: markerGroup,
      dialogueTree: def.dialogueTree,
      interactionRadius: 3.5
    });
  }

  update(delta, time) {
    // Bob and rotate floating quest markers
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

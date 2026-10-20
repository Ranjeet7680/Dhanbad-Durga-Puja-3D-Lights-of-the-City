# Dhanbad Durga Puja 3D: Lights of the City
## 3D Festival World Simulator & Exploration Prototype

Inspired by the Dhanbad Durga Puja design documents:
- `Dhanbad_Durga_Puja_3D_World_Map_Mela_Design.pdf`
- `Dhanbad_Durga_Puja_3D_Game_Architecture.pdf`

---

### 🌟 Implemented Features

1. **3D World & District Topology**:
   - **Central Festival Hub**: Welcome Toran gateway with marigold garlands, information board kiosk, lanterns, and Aheli's volunteer station.
   - **Illuminated Light Tunnel**: 40-meter curved archway with dynamic animated chasing LED lights.
   - **Housing Colony Pandal (P0 Hero)**: Multi-tiered Bengali Chala-style architecture, ornate fabric brocade interior ceiling, Alpona floor art, elevated altar with respectful Pratima silhouette, flickering brass diyas, and procedural rising incense smoke particles.
   - **Mega Mela & Fairground**:
     - **Giant Wheel (Jhula)**: 24m tall steel lattice wheel with 12 suspended passenger gondolas (gravitationally oriented), rotating rim lights, boarding platform, and scenic panoramic ride mode!
     - **Carousel (Merry-Go-Round)**: Striped canopy with bobbing festive wooden horses.
     - **Food Lane**: Kolkata Puchka & Chaat, Garam Jalebi & Mithai, Dhanbad Special Chai Adda.
     - **Game Stall & Dhak Stage**: Traditional percussion stage with feathers (Kash phool).
   - **Jharudih Craft Lane**: Artisan courtyard with Madan da's workshop, bamboo stacks, and 3 collectible Golden Lotus bundles.
   - **Heritage Lane**: Purana Bazar entrance and Dida's oral history station.

2. **The Festival Pulse (Lighting & Timeline)**:
   - Dynamic time-of-day timeline from 16:30 to 23:00.
   - Realistic sky color grading, sun/moon movement, atmospheric fog, and emissive bloom transitions (Dusk ➔ Blue Hour ➔ Peak Night ➔ Midnight).
   - Real-time time slider and quick presets in Settings.

3. **Audio Director (Procedural Web Audio API)**:
   - Synthetic authentic **Bengali Dhak rhythm** (*dha-tin-tin-na*) with brass Kanshi bell chime.
   - Dynamic distance attenuation (drum beats grow louder as you approach the Pandal or Dhak stage).
   - Shutter snap sound for Photo Mode and fanfare chimes upon quest completion.
   - Master volume slider and sound mute toggle.

4. **Narrative & Quests: "The Five Lights of Dhanbad"**:
   - **Chapter 1: The Welcome Light** (Aheli at Central Hub)
   - **Chapter 2: The Craft Light** (Madan da at Jharudih)
   - **Chapter 3: The Courage Light** (Imran at Mega Mela Jhula)
   - **Chapter 4: The Community Light** (Rupa at Food Lane)
   - **Chapter 5: The Home Light** (Dida at Heritage Lane)

5. **Pandal Passport & Memory Lens (Photo Mode)**:
   - **Passport Book [J]**: Collectible verified stamps for all 5 districts, 5 Lights progress, and tokens.
   - **Memory Lens [P]**: Custom photo mode with rule-of-thirds grid, decorative festive ornate gold frame, Dhanbad Durga Puja 2026 watermark, timestamp, and instant high-res postcard download.
   - **Minimap Radar**: Real-time compass and landmark navigation dots.

---

### 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

Open your browser at `http://localhost:3000` to enter the festival!

### 🎮 Controls

| Action | Keyboard | Touch / Mobile |
| :--- | :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` or Arrow Keys | On-screen Virtual Joystick |
| **Sprint** | `Shift` | Auto / Fast drag |
| **Jump** | `Space` | Jump Touch Button |
| **Look / Orbit** | Click & Drag Mouse | Drag Screen |
| **Interact / Talk / Board** | `E` | `E` Touch Button |
| **Memory Lens (Photo)** | `P` or Top Icon | Top Icon |
| **Pandal Passport** | `J` or Top Icon | Top Icon |
| **Toggle Dhak Sound** | `M` or Top Icon | Top Icon |
| **Settings & Clock Slider**| `O` or Top Icon | Top Icon |

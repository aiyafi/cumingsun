# Coming Soon Page for [UGD](https://github.com/gadjahduduk)

A stunning 3D "Coming Soon" page for [UGD](https://github.com/gadjahduduk) featuring glass-like epoxy resin text effects built with React Three Fiber.

## ✨ Features

- **3D Glass Text Effect**: Realistic epoxy resin/glass material with refraction
- **Dynamic Lighting**: Multiple light sources creating realistic reflections
- **Interactive Controls**: Mouse/touch controls for camera rotation and zoom
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Soft Shadows**: Accumulative shadows for enhanced depth
- **High Performance**: Optimized rendering with configurable quality settings

## 🚀 Demo

[Live Demo](https://www.gadjahduduk.life)

## 📱 Device Support

- **Desktop**: Full quality with mouse controls
- **Tablet**: Optimized quality with touch controls
- **Mobile**: Performance-optimized with adjusted zoom levels

## 🛠️ Technologies Used

- **React 18.2.0** - UI Framework
- **Three.js 0.151.3** - 3D Graphics Library
- **@react-three/fiber 8.12.2** - React renderer for Three.js
- **@react-three/drei 9.65.5** - Useful helpers for React Three Fiber
- **@react-three/postprocessing 2.7.1** - Post-processing effects
- **Leva 0.9.34** - GUI controls for development

## 📦 Installation

### Prerequisites
- Node.js (version 16 or higher)
- pnpm (recommended) or npm/yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cumingsun
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 Usage

### Controls
- **Mouse/Touch Drag**: Rotate camera around the scene
- **Scroll/Pinch**: Zoom in/out (desktop/tablet only)
- **Auto-rotation**: Disabled by default (can be enabled in code)

### Customization

#### Text Content
Edit the text in `src/App.js`:
```javascript
const text = 'Coming Soon' // Change this to your desired text
```

#### Material Properties
Adjust the glass/epoxy material in the `config` object:
```javascript
const config = {
  transmission: 1,        // Glass transparency
  thickness: 0.3,         // Material thickness
  roughness: 0,           // Surface roughness
  chromaticAberration: 0.15, // Color separation effect
  ior: 1.25,             // Index of refraction
  // ... more properties
}
```

#### Colors & Lighting
- Background color: `<color attach="background" args={['#f2f2f5']} />`
- Shadow color: `const shadow = '#94cbff'`
- Light intensities: Adjust `Lightformer` intensity values

## 📁 Project Structure 
```
cumingsun/
├── public/
│ ├── index.html
│ ├── Manrope_Regular.json # 3D font file
│ └── GadjahDuduk.svg
├── src/
│ ├── App.js # Main React component
│ ├── index.js # App entry point
│ ├── Loader.js # Loading component
│ └── styles.css # Global styles
├── package.json
├── .gitignore
├── .prettierrc
└── README.md
```


## 🎨 Customization Guide

### Changing Colors
1. **Background**: Modify the `color` component in Canvas
2. **Text**: Adjust the `color` property in material config
3. **Shadows**: Change the `shadow` variable
4. **Grid**: Update colors in `meshBasicMaterial` and `gridHelper`

### Performance Tuning
Adjust quality settings in the `config` object:
- `samples`: Lower for better performance (4-8)
- `resolution`: Reduce for mobile (256-512)
- `backsideThickness`: Affects rendering cost

### Font Changes
Replace `Manrope_Regular.json` in the public folder with your preferred 3D font file.

## 🐛 Troubleshooting

### Common Issues

**Performance on Mobile**
- The app automatically detects mobile devices and reduces quality
- If still slow, further reduce `samples` and `resolution` values

**Font Not Loading**
- Ensure `Manrope_Regular.json` is in the `public` folder
- Check browser console for loading errors

**HDRI Environment Not Loading**
- The app uses an external HDR environment map
- Ensure internet connection for loading from `dl.polyhaven.org`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [Polyhaven](https://polyhaven.org/) - HDR environment maps
- [Drei](https://github.com/pmndrs/drei) - Useful helpers for React Three Fiber

---

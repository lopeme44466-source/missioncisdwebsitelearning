// Stealth Cloak presets for tab title and favicon disguised as school platforms

export const CLOAK_PRESETS = [
  {
    id: 'mission-cisd',
    name: 'Mission CISD Portal',
    title: 'Mission CISD - Student Portal & Skyward Access',
    iconUrl: 'https://www.google.com/s2/favicons?domain=mcisd.net&sz=64',
    badge: 'MCISD',
    bgColor: '#1e3a8a',
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    iconUrl: 'https://ssl.gstatic.com/classroom/favicon.png',
    badge: 'Classroom',
    bgColor: '#15803d',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    iconUrl: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    badge: 'Drive',
    bgColor: '#0284c7',
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    iconUrl: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    badge: 'Docs',
    bgColor: '#2563eb',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas LMS',
    iconUrl: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    badge: 'Canvas',
    bgColor: '#b91c1c',
  },
  {
    id: 'khan-academy',
    name: 'Khan Academy',
    title: 'Dashboard | Khan Academy',
    iconUrl: 'https://www.khanacademy.org/favicon.ico',
    badge: 'Khan',
    bgColor: '#059669',
  },
  {
    id: 'edgenuity',
    name: 'Edgenuity Student',
    title: 'Edgenuity - Student Courseware',
    iconUrl: 'https://www.google.com/s2/favicons?domain=edgenuity.com&sz=64',
    badge: 'Edgenuity',
    bgColor: '#ea580c',
  },
];

export function applyCloakPreset(presetId) {
  const preset = CLOAK_PRESETS.find((p) => p.id === presetId) || CLOAK_PRESETS[0];
  document.title = preset.title;

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = preset.iconUrl;

  try {
    localStorage.setItem('mateo_cloak_preset', preset.id);
  } catch (e) {
    // Local storage ignore in iframe
  }
}

export function getSavedCloakPreset() {
  try {
    const saved = localStorage.getItem('mateo_cloak_preset');
    return CLOAK_PRESETS.find((p) => p.id === saved) || CLOAK_PRESETS[0];
  } catch (e) {
    return CLOAK_PRESETS[0];
  }
}

/**
 * Opens the current URL or target URL inside a stealth 'about:blank' window with full iframe.
 * Prevents history logging and circumvents simple URL filters.
 */
export function openAboutBlankCloak(targetUrl = window.location.href, presetId = 'mission-cisd') {
  const preset = CLOAK_PRESETS.find((p) => p.id === presetId) || CLOAK_PRESETS[0];
  const cloakWindow = window.open('about:blank', '_blank');

  if (!cloakWindow) {
    // Popup was blocked
    return false;
  }

  const doc = cloakWindow.document;
  doc.title = preset.title;

  // Set favicon
  const link = doc.createElement('link');
  link.rel = 'icon';
  link.href = preset.iconUrl;
  doc.head.appendChild(link);

  // Set style to fill viewport
  const style = doc.createElement('style');
  style.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0b0f19; font-family: system-ui, sans-serif; }
    iframe { width: 100%; height: 100%; border: none; outline: none; }
    #stealth-bar {
      display: none;
    }
  `;
  doc.head.appendChild(style);

  // Set iframe embed
  const iframe = doc.createElement('iframe');
  iframe.src = targetUrl;
  iframe.allow = 'camera; microphone; fullscreen; autoplay; clipboard-write; encrypted-media';
  iframe.setAttribute('allowfullscreen', 'true');
  doc.body.appendChild(iframe);

  return true;
}

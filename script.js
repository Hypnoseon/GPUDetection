document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    let gl;
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
        document.getElementById('gpu-info').innerHTML = 'Unable to initialize WebGL. Your browser may not support it.';
        return;
    }

    if (!gl) {
        document.getElementById('gpu-info').innerHTML = 'WebGL is not supported by your browser.';
        return;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    let renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Not Available";

    // More flexible regex to accurately capture brand, series, and model
    let match = renderer.match(/(NVIDIA|AMD|Intel).*?(GeForce\s*|Radeon\s*|RX\s*|GTX\s*|RTX\s*|VEGA\s*)?(\d+\s*[A-Za-z]*\s*\d*\w*)/i);
    if (match && match.length > 3) {
        // Constructs a detailed GPU name using the captured groups, excluding undefined captures
        renderer = `${match[1]} ${match[2] ? match[2] : ''}${match[3]}`.trim();
    }

    function getPerformanceMessage(rendererName) {
        if (rendererName.includes("RTX")) {
            return "You should be good!";
        } else if (rendererName.includes("GTX")) {
            return "You will be fine but not great.";
        } else if (rendererName.includes("XT") || rendererName.includes("RX")) {
            return "You should be good.";
        } else if (rendererName.includes("VEGA")) {
            return "Will probably not work.";
        } else {
            return "GPU information not detailed enough for a specific recommendation / or try another browser.";
        }
    }

    const performanceMessage = getPerformanceMessage(renderer);
    document.getElementById('gpu-info').innerHTML = `
        <h1 class="text-3xl font-bold mb-2">GPU Information</h1>
        <p class="text-lg"><span class="font-semibold">GPU:</span> ${renderer}</p>
        <p class="mt-4 px-4 py-2 rounded-lg ${
            renderer.includes("RTX") || renderer.includes("XT") || renderer.includes("RX") ? 'bg-green-500' : 
            renderer.includes("GTX") ? 'bg-yellow-500' : 
            'bg-red-500'
        } text-white">${performanceMessage}</p>
    `;
});

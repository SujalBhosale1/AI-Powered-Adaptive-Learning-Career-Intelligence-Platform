const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'Trialtheme');
const destDir = path.join(__dirname, 'one-stop-frontend', 'src');

const componentsToCopy = [
  "ActivityFeed.jsx", "ChatbotWidget.jsx", "FAQ.jsx", "FeatureCard.jsx",
  "Footer.jsx", "InternshipCard.jsx", "Layout.jsx", "ProjectIdeaGenerator.jsx",
  "RecommendationCard.jsx", "ResumeBuilder.jsx", "RoadmapTimeline.jsx",
  "sidebar.jsx", "SkillBadge.jsx", "StatsOverview.jsx", "ThemeToggle.jsx"
];

const pagesToCopy = [
  "LandingPage.jsx", "FlowPage.jsx", "CreditPage.jsx", "PaymentPage.jsx",
  "ProgressPage.jsx", "HelpPage.jsx"
];

function copyFile(relSource, relDest) {
  const srcPath = path.join(sourceDir, relSource);
  const destPath = path.join(destDir, relDest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('Copied: ' + relDest);
  } else {
    console.log('Missing: ' + srcPath);
  }
}

componentsToCopy.forEach(c => copyFile('components/' + c, 'components/' + c));
pagesToCopy.forEach(p => copyFile('pages/' + p, 'pages/' + p));
console.log('Done copying pure UI files.');

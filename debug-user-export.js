const tar = require('tar');
const fs = require('fs');
const path = require('path');

const tarballPath = 'C:\\Users\\0xAnakin\\Desktop\\sandbox\\export-2026-01-19T19-28-48-323Z.tar.gz';
const targetFile = 'data.json';

const extractData = () => {
    fs.createReadStream(tarballPath)
        .pipe(new tar.Parse())
        .on('entry', entry => {
            if (entry.path.endsWith('data.json')) {
                let content = '';
                entry.on('data', chunk => content += chunk);
                entry.on('end', () => {
                    const json = JSON.parse(content);
                    const types = json.types || {};
                    
                    // Check Ctv-Page home
                    const pages = types['api::ctv-page.ctv-page'] || [];
                    const homePage = pages.find(p => p.slug === 'home');
                    if (homePage) {
                        console.log('--- Home Page Components ---');
                        homePage.components.forEach(c => {
                            if (c.__component === 'ctv-sections.main-carousel') {
                                console.log('Main Carousel Component:', JSON.stringify(c, null, 2));
                            }
                        });
                    } else {
                        console.log('Home Page NOT FOUND');
                    }

                     // Check Ctv-Carousel
                    const carousels = types['api::ctv-carousel.ctv-carousel'] || [];
                    const mainCarousel = carousels.find(c => c.cmsTitle === 'Main Carousel - Home');
                    if (mainCarousel) {
                        console.log('--- Main Carousel - Home ---');
                        console.log('Slides:', JSON.stringify(mainCarousel.slides, null, 2));
                    } else {
                        console.log('Main Carousel - Home NOT FOUND');
                    }

                });
            } else {
                entry.resume();
            }
        });
};

extractData();

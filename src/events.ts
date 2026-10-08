// Data for events SAE participates in and hosts
const eventData = [
    {
        title: "BAJA SAE India",
        date: "Annual National Competition",
        desc: "Our flagship participation event. We design, fabricate, and race a rugged single-seater all-terrain vehicle. The team goes through intense design evaluations, dynamic testing, and a grueling endurance race.",
        img: "https://via.placeholder.com/600x350/1e293b/eab308?text=BAJA+SAE+India",
        upcoming: "Next Event: February 2027"
    },
    {
        title: "CAD Design Workshop",
        date: "Hosted by SAE BIT Sindri",
        desc: "A comprehensive hands-on workshop focused on SolidWorks and AutoCAD. We train our members and fellow students in the fundamentals of 3D modeling and simulation essential for automotive component design.",
        img: "https://via.placeholder.com/600x350/1e293b/eab308?text=CAD+Design+Workshop",
        upcoming: "Coming Up: November 12, 2026"
    },
    {
        title: "SUPRA SAE India",
        date: "Annual National Competition",
        desc: "The ultimate formula student competition. We engineer a formula-style race car from scratch, focusing on aerodynamics, power-to-weight ratio, and precision handling on the track.",
        img: "https://via.placeholder.com/600x350/1e293b/eab308?text=SUPRA+SAE+India",
        upcoming: "" 
    },
    {
        title: "Engine Teardown Session",
        date: "Hosted by SAE BIT Sindri",
        desc: "Get your hands dirty in this interactive session where we dismantle and rebuild a standard IC engine. Understand powertrain mechanics, transmission systems, and performance tuning.",
        img: "https://via.placeholder.com/600x350/1e293b/eab308?text=Engine+Teardown+Session",
        upcoming: "Coming Up: December 5, 2026"
    }
];

export function initEventsUI() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const displayWrapper = document.getElementById('details-display');
    const displayImg = document.getElementById('display-img') as HTMLImageElement | null;
    const displayTitle = document.getElementById('display-title');
    const displayDate = document.getElementById('display-date');
    const displayDesc = document.getElementById('display-desc');
    const displayUpcoming = document.getElementById('display-upcoming');

    // Safety check: only run if the events page is actually in the DOM
    if (!displayWrapper || !displayImg || timelineItems.length === 0) return;

    let currentIndex = -1;

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const indexAttr = entry.target.getAttribute('data-index');
                if (!indexAttr) return;
                
                const index = parseInt(indexAttr);
                
                timelineItems.forEach(item => item.classList.remove('active'));
                entry.target.classList.add('active');

                if (currentIndex !== index) {
                    currentIndex = index;
                    updateDetails(eventData[index]);
                }
            }
        });
    }, observerOptions);

    timelineItems.forEach((item, idx) => {
        item.addEventListener('click', () => {
            timelineItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            if (currentIndex !== idx) {
                currentIndex = idx;
                updateDetails(eventData[idx]);
            }
        });
        observer.observe(item);
    });

    function updateDetails(data: any) {
        displayWrapper?.classList.add('fade-out');
        
        setTimeout(() => {
            if (displayImg) displayImg.src = data.img;
            if (displayTitle) displayTitle.textContent = data.title;
            if (displayDate) displayDate.textContent = data.date;
            if (displayDesc) displayDesc.textContent = data.desc;
            
            // Logic for the upcoming badge
            if (displayUpcoming) {
                if (data.upcoming && data.upcoming.trim() !== "") {
                    displayUpcoming.textContent = data.upcoming;
                    displayUpcoming.classList.remove('hidden');
                } else {
                    displayUpcoming.classList.add('hidden');
                }
            }
            
            displayWrapper?.classList.remove('fade-out');
        }, 400); 
    }
}
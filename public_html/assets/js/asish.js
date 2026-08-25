

// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// protfolio filters
$(window).on("load", function() {
    var t = $(".portfolio-container");
    t.isotope({
        filter: ".new",
        animationOptions: {
            duration: 750,
            easing: "linear",
            queue: !1
        }
    }), $(".filters a").click(function() {
        $(".filters .active").removeClass("active"), $(this).addClass("active");
        var i = $(this).attr("data-filter");
        return t.isotope({
            filter: i,
            animationOptions: {
                duration: 750,
                easing: "linear",
                queue: !1
            }
        }), !1
    });
});

// rotating event gallery
$(function() {
    var galleryItems = [
        { category: "hackathon", title: "Solve for India Googlecloud x AMD", detail: "South Regionals · 2023", image: "assets/imgs/GC x AMD.jpeg" },
        { category: "hackathon", title: "Smart India Hackathon-2022 ", detail: "Product prototype", image: "assets/imgs/sih.jpg" },
        { category: "hackathon", title: "Buildclub x Lovable Hackathon", detail: "Team collaboration", image: "assets/imgs/buildclub.jpeg" },
        { category: "hackathon", title: "Hackthegong2026", detail: "EHUB - P2P Energy credits Transfer", image: "assets/imgs/Hachgong.jpg" },
        { category: "conference", title: "Indian Blockchain Week", detail: "Engineering talks", image: "assets/imgs/IBW.jpeg" },
        { category: "conference", title: "Australian Crypto Con ", detail: "Cloud sessions", image: "assets/imgs/AusCrp.jpg" },
        { category: "conference", title: "Microsoft AI Tour", detail: "Networking and learning", image: "assets/imgs/AItour.jpeg" },
        { category: "community", title: "Google Cloud Career Campaign", detail: "Facilitator · 2023", image: "assets/imgs/GCF.jpg" },
        { category: "community", title: "AWS Summit 2026", detail: "AWS Community", image: "assets/imgs/AWSSUmit.jpg" },
        { category: "community", title: "Lovable ", detail: "Community networking", image: "assets/imgs/lovable.jpg" },
        { category: "workshop", title: "Google Kubernetes Engine", detail: "Hands-on workshop", image: "assets/imgs/GDSC.jpg" },
        { category: "workshop", title: "Aptos Mini Build Weekv", detail: "Building Web3 Applications on Aptos chain", image: "assets/imgs/aptos.jpeg" },
        { category: "workshop", title: "UNFOLD2024", detail: "Speaker session-Crypto", image: "assets/imgs/Unfold.jpg" }
    ];
    var activeCategory = "all";
    var galleryOffset = 0;
    var galleryPaused = false;
    var $tiles = $(".gallery-tile");

    function activeItems() {
        return activeCategory === "all"
            ? galleryItems
            : galleryItems.filter(function(item) { return item.category === activeCategory; });
    }

    function renderGallery() {
        var items = activeItems();
        $tiles.each(function(index) {
            var $tile = $(this);
            var item = items[(galleryOffset + index) % items.length];
            $tile.addClass("is-changing");
            window.setTimeout(function() {
                $tile.find(".gallery-image").css("background-image", "url('" + item.image + "')");
                $tile.find(".gallery-caption span").text(item.category);
                $tile.find(".gallery-caption h3").text(item.title);
                $tile.find(".gallery-caption p").text(item.detail);
                $tile.removeClass("is-changing");
            }, 220);
        });
        galleryOffset = (galleryOffset + 1) % items.length;
    }

    $(".gallery-filter").on("click", function() {
        activeCategory = $(this).data("gallery-filter");
        galleryOffset = 0;
        $(".gallery-filter").removeClass("active");
        $(this).addClass("active");
        renderGallery();
    });

    $(".gallery-pause").on("click", function() {
        galleryPaused = !galleryPaused;
        $(this).attr("aria-pressed", galleryPaused).text(galleryPaused ? "Resume rotation" : "Pause rotation");
    });

    if ($tiles.length) {
        renderGallery();
        window.setInterval(function() {
            if (!galleryPaused) renderGallery();
        }, 4000);
    }
});

// latest Medium posts
$(function() {
    var feedUrl = "https://medium.com/feed/@go-for-it";
    var mediumProfile = "https://medium.com/@go-for-it";
    var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);
    var blogList = document.getElementById("medium-blog-list");
    var blogStatus = document.getElementById("medium-blog-status");

    if (!blogList) return;

    function articleDocument(html) {
        return new DOMParser().parseFromString(html || "", "text/html");
    }

    function articleImage(item) {
        if (item.thumbnail) return item.thumbnail;
        var image = articleDocument(item.description || item.content).querySelector("img");
        return image ? image.src : "assets/imgs/B1.webp";
    }

    function articleExcerpt(item) {
        var text = articleDocument(item.description || item.content).body.textContent.replace(/\s+/g, " ").trim();
        return text.length > 180 ? text.slice(0, 177).trim() + "..." : text;
    }

    function articleDate(value) {
        var date = new Date(String(value).replace(" ", "T") + "Z");
        return isNaN(date.getTime()) ? "Latest article" : date.toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function createPost(item) {
        var card = document.createElement("a");
        var art = document.createElement("div");
        var image = document.createElement("img");
        var copy = document.createElement("div");
        var meta = document.createElement("p");
        var title = document.createElement("h3");
        var excerpt = document.createElement("p");
        var arrow = document.createElement("span");

        card.className = "medium-blog-card";
        card.href = item.link || mediumProfile;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.setAttribute("aria-label", "Read " + item.title + " on Medium");

        art.className = "medium-blog-art";
        image.src = articleImage(item);
        image.alt = "";
        image.loading = "lazy";
        image.addEventListener("error", function() { image.src = "assets/imgs/B1.webp"; }, { once: true });
        art.appendChild(image);

        copy.className = "medium-blog-copy";
        meta.className = "medium-blog-meta";
        meta.textContent = articleDate(item.pubDate) + " · Medium";
        title.textContent = item.title;
        excerpt.textContent = articleExcerpt(item);
        copy.append(meta, title, excerpt);

        arrow.className = "medium-blog-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        card.append(art, copy, arrow);
        return card;
    }

    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) throw new Error("Medium feed request failed");
            return response.json();
        })
        .then(function(data) {
            if (data.status !== "ok" || !Array.isArray(data.items) || !data.items.length) {
                throw new Error("Medium feed is empty");
            }

            var latestPosts = data.items.slice().sort(function(a, b) {
                return new Date(b.pubDate.replace(" ", "T")) - new Date(a.pubDate.replace(" ", "T"));
            }).slice(0, 3);

            var fragment = document.createDocumentFragment();
            latestPosts.forEach(function(item) { fragment.appendChild(createPost(item)); });
            blogList.replaceChildren(fragment);
            if (blogStatus) blogStatus.textContent = latestPosts.length + " latest posts";
        })
        .catch(function() {
            if (blogStatus) blogStatus.textContent = "Latest posts";
        });
});

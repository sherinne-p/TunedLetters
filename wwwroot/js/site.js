// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

(() => {
    const songRows = document.getElementById("song-rows");
    if (!songRows) return;

    const searchInput = document.getElementById("song-search");
    const sortSelect = document.getElementById("song-sort");
    const songCount = document.getElementById("song-count");
    const emptyMessage = document.getElementById("songs-empty");
    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    const normalize = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Keep original rows and positions so clearing a filter restores every song.
    const songs = Array.from(songRows.rows, (row, index) => {
        const title = row.cells[1].textContent.trim();
        const artist = row.cells[2].textContent.trim();
        const album = row.cells[3].textContent.trim();
        const duration = row.cells[4].textContent.trim().split(":")
            .reduce((seconds, part) => seconds * 60 + Number(part), 0);
        return { row, index, title, artist, duration, searchText: normalize(`${title} ${artist} ${album}`) };
    });

    function updateSongs() {
        const terms = normalize(searchInput.value).trim().split(/\s+/).filter(Boolean);
        const sortBy = sortSelect.value;
        const sorted = [...songs].sort((a, b) => {
            if (sortBy === "playlist") return a.index - b.index;
            let comparison = 0;
            if (sortBy === "duration") comparison = a.duration - b.duration;
            else if (sortBy === "title" || sortBy === "artist") {
                comparison = collator.compare(a[sortBy], b[sortBy]);
            } else return a.index - b.index;
            return comparison || collator.compare(a.title, b.title) || a.index - b.index;
        });

        const fragment = document.createDocumentFragment();
        let visibleCount = 0;
        for (const song of sorted) {
            const matches = terms.every(term => song.searchText.includes(term));
            song.row.hidden = !matches;
            if (matches) visibleCount++;
            fragment.appendChild(song.row);
        }
        songRows.appendChild(fragment);
        songCount.textContent = terms.length ? `${visibleCount} of ${songs.length} songs` : `${songs.length} songs`;
        emptyMessage.hidden = visibleCount !== 0;
    }

    searchInput.addEventListener("input", updateSongs);
    sortSelect.addEventListener("change", updateSongs);
    updateSongs();
})();

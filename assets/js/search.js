function searchAlbums(){
  const input = document.getElementById('searchInput').value.toLowerCase();
  const filtered = albumsData.filter(a=>a.name.toLowerCase().includes(input));
  renderAlbums(filtered);
}

const fs = require("fs");

const file = "public/script.js";
let source = fs.readFileSync(file, "utf8");

source = source.replace(
  /function renderFilters\(\) \{[\s\S]*?\n\}/,
  `function renderFilters() {
  const filtersNode = document.querySelector("[data-filters]");
  if (!filtersNode) return;

  const categories = [["all", t("all")], ...productCategories().map((category) => [category.id, categoryLabel(category.id)])];
  const selectedCategories = selectedShopCategories();

  filtersNode.innerHTML = categories
    .map(([value, label]) => {
      const isActive = value === "all" ? !selectedCategories.length : selectedCategories.includes(value);
      return \`<button class="\${isActive ? "active" : ""}" type="button" data-filter="\${value}" aria-pressed="\${isActive ? "true" : "false"}">\${label}</button>\`;
    })
    .join("");
}`
);

source = source.replace(
  /function renderShopCategories\(\) \{[\s\S]*?\n\}\n\nfunction productButton/,
  `function renderShopCategories() {
  const node = document.querySelector("[data-shop-categories]");
  if (!node) return;
  const selectedCategories = selectedShopCategories();
  const allSelected = !selectedCategories.length;
  const allCard = \`
    <button class="shop-category-card all-category-card \${allSelected ? "active" : ""}" type="button" data-filter="all" aria-pressed="\${allSelected ? "true" : "false"}">
      <span class="shop-category-icon">DD</span>
      <span class="shop-category-copy">
        <strong>\${t("all")}</strong>
        <small>\${visibleItems(data.products).length} товаров</small>
      </span>
      <em aria-label="\${allSelected ? "Выбрано" : "Показать все"}">\${allSelected ? "✓" : "+"}</em>
    </button>
  \`;
  node.innerHTML = allCard + productCategories()
    .map((category) => {
      const count = visibleItems(data.products).filter((product) => product.category === category.id).length;
      const title = ddText(category.title, currentLang);
      const image = category.image || "";
      const icon = category.icon || "#";
      const isSelected = selectedCategories.includes(category.id);
      return \`
          <button class="shop-category-card \${isSelected ? "active" : ""}" type="button" data-filter="\${category.id}" aria-pressed="\${isSelected ? "true" : "false"}">
          <span class="shop-category-icon" \${image ? \`style="background-image:url('\${image}')"\` : ""}>\${image ? "" : icon}</span>
          <span class="shop-category-copy">
            <strong>\${title}</strong>
            <small>\${count} товаров</small>
          </span>
          <em aria-label="\${isSelected ? "Выбрано" : "Выбрать раздел"}">\${isSelected ? "✓" : "+"}</em>
        </button>
      \`;
    })
    .join("");
}

function productButton`
);

source = source.replace(
  /\.filter\(\(product\) => shopState\.filter === "all" \|\| product\.category === shopState\.filter\)/,
  `.filter((product) => {
      const selectedCategories = selectedShopCategories();
      return !selectedCategories.length || selectedCategories.includes(product.category);
    })`
);

source = source.replace(
  /productsNode\.classList\.toggle\("is-grouped", shopState\.filter === "all" && !shopState\.search\);\s*productsNode\.innerHTML = products\.length\s*\? shopState\.filter === "all" && !shopState\.search\s*\? groupedProductMarkup\(products\)\s*: products\.map\(productCardMarkup\)\.join\(""\)\s*: `<div class="shop-empty">[\s\S]*?<\/div>`;/,
  `const selectedCategories = selectedShopCategories();
  const shouldGroupProducts = !shopState.search && selectedCategories.length !== 1;
  productsNode.classList.toggle("is-grouped", shouldGroupProducts);
  productsNode.innerHTML = products.length
    ? shouldGroupProducts
      ? groupedProductMarkup(products)
      : products.map(productCardMarkup).join("")
    : \`<div class="shop-empty">Ничего не найдено</div>\`;`
);

source = source.replace(
  /if \(filterButton\) \{[\s\S]*?renderProducts\(\);\s*\}/,
  `if (filterButton) {
    const filter = filterButton.dataset.filter;
    if (filter === "all") {
      setShopCategories([]);
    } else {
      const selectedCategories = selectedShopCategories();
      setShopCategories(selectedCategories.includes(filter)
        ? selectedCategories.filter((id) => id !== filter)
        : [...selectedCategories, filter]);
    }
    renderFilters();
    renderShopCategories();
    renderProducts();
    scrollToShopProducts();
  }`
);

fs.writeFileSync(file, source, "utf8");

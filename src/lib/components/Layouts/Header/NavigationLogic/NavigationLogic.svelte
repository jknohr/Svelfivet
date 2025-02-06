<script lang="ts">
    import type { NavigationItem, NavigationConfig } from '$lib/types/vista';
    
    // Props
    let navigationItems: NavigationItem[] = [];
    let searchQuery = $state('');
    let searchResults = $state<NavigationItem[]>([]);
    let selectedCategory = $state<string | null>(null);
    
    // Fix for line 159 - Add proper type for category parameter
    function handleItemSelect(item: NavigationItem) {
        selectedCategory = item.label;
    }
    
    // Fix for line 248 - Ensure array operations are properly typed
    function filterNavigationItems() {
        return navigationItems.filter((item: NavigationItem) => {
            return item.label.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }
    
    // Fix for lines 248-249 - Add type assertions for category
    $effect(() => {
        const results: SearchResult[] = [];
        const filteredCategories = filterCategories();
        
        for (const category of filteredCategories) {
            results.push({
                type: 'category',
                text: category.name
            });
            
            if (category.sub) {
                category.sub.forEach(sub => {
                    results.push({
                        type: 'subcategory',
                        text: sub.name,
                        parent: category.name
                    });
                });
            }
        }
        
        searchResults = results;
    });
    
    // Fix for lines 260-261 - Add type assertions for category
    function isCategoryActive(category: Category): boolean {
        return selectedCategory === category.name;
    }
    
    function getCategoryIcon(category: Category): string {
        return category.icon || 'folder';
    }
    
    // Fix for lines 266-269 - Add type assertions for category
    function handleCategoryClick(category: Category) {
        if (isCategoryActive(category)) {
            selectedCategory = null;
        } else {
            selectedCategory = category.name;
        }
    }
</script>

<div class="navigation-logic">
    <!-- Your template code here -->
</div>

<script lang="ts">
  import { currentContext } from '$lib/stores/context';
  import { contextConfigs, navigationAccess } from '$lib/components/Vistas/navigation';
  
  // ...existing navigation code...

  // Add role-based access control
  $effect(() => {
    const userRole = 'user'; // Replace with actual user role from auth
    const allowedSections = navigationAccess.roles[userRole] || [];
    
    if ($currentContext?.current) {
      const config = contextConfigs[$currentContext.current];
      navigationItems = config.navigation.main.filter(item => 
        allowedSections.includes(item.metadata?.category || 'main')
      );
    }
  });
</script>

<!-- ...existing template... -->

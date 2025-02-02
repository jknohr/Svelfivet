Create A mermaid Diagram for this setup

BaseLayout
        |
        |_ Header 7.5% Height can Expand to 15% on hover
        |         |____ Vistas Menu Button ( static ) 10%
        |         |____ NavigationBar ( Dynamic changes based on Context Button, Changes AUTH ) 
        |         |____ Login Button ( transform to User Menu Upon Login )  10%
        |
        ¦_ Body 78.5%-85% depending on top menu interactions
        |         ¦____ AIContentPanel (L)(Collapsed 2.5 width)expand 25% width on hover or active_request)
        |         ¦____ MainBodyContentArea ( Main content Area Where each webpage load.)
        |         ¦____ UserControlPanel (R)(Collapsed 2.5 width)expand 25% width on hover or active_request)
        |
        ¦_Footer 7.5% height
                  ¦____ SocialMedia&Contact
                  ¦____ Breadcrum Navigation
                  ¦____ AIChatInterface.

AIContentPanel and UserControlPanel Are sticky and follow MainBodyContentArea as you scroll down the page... if it is a long page... 

/home/subtomic/svelfivet/Svelfivet/src/lib/components/Organisms/NavBars/NavigationBar.svelte
/home/subtomic/svelfivet/Svelfivet/src/lib/components/Organisms/NavBars/UserNavbar.svelte
/home/subtomic/svelfivet/Svelfivet/src/lib/components/Organisms/NavBars/VistaMenu.svelte

All Common and shared components are loaded from lib/components...
Navigation and Navigation Specific Content is loaded from 
lib/vistas/navigation.ts
Each Vista have a file with Menu Definitions... and icons for loading the NavigationMenu with the right content for the Vista
lib/vistas/real-estate.ts
lib/vistas/user.ts
lib/vistas/systemAdmin.ts
lib/vistas/aisearch.ts

Further more 
lib/vistas/real-estate/BodyLayout.ts  ( component specific to this vista will also be here. )
lib/vistas/user/BodyLayout.ts  ( component specific to this vista will also be here. )
lib/vistas/systemAdmin/BodyLayout.ts  ( component specific to this vista will also be here. )
lib/vistas/aisearch/BodyLayout.ts  ( component specific to this vista will also be here. )

graph TD
    BaseLayout --> Header
    BaseLayout --> Body
    BaseLayout --> Footer

    Header[Header (7.5% Height, Expands to 15% on Hover)] 
    Header --> VistasMenuButton[Vistas Menu Button (Static, 10% Width)]
    Header --> NavigationBar[Navigation Bar (Dynamic, AUTH Changes)]
    Header --> LoginButton[Login Button (Transforms to User Menu, 10% Width)]

    Body[Body (78.5%-85% Height Based on Header Interaction)]
    Body --> AIContentPanel[AI Content Panel (L) (Collapsed: 2.5%, Expanded: 25% on Hover/Active, Sticky)]
    Body --> MainBodyContentArea[Main Body Content Area (Dynamic Webpage Content)]
    Body --> UserControlPanel[User Control Panel (R) (Collapsed: 2.5%, Expanded: 25% on Hover/Active, Sticky)]

    Footer[Footer (7.5% Height)]
    Footer --> SocialMediaContact[Social Media & Contact]
    Footer --> BreadcrumbNav[Breadcrumb Navigation]
    Footer --> AIChatInterface[AI Chat Interface]

    %% File Organization
    subgraph lib/components [Common & Shared Components]
    end

    subgraph lib/vistas [Vistas]
        lib/vistas/navigation.ts
        lib/vistas/real-estate.ts
        lib/vistas/user.ts
        lib/vistas/systemAdmin.ts
        lib/vistas/aisearch.ts
    end

    lib/vistas/real-estate.ts --> RealEstateBodyLayout[real-estate/BodyLayout.ts]
    lib/vistas/user.ts --> UserBodyLayout[user/BodyLayout.ts]
    lib/vistas/systemAdmin.ts --> SystemAdminBodyLayout[systemAdmin/BodyLayout.ts]
    lib/vistas/aisearch.ts --> AISearchBodyLayout[aisearch/BodyLayout.ts]


    Goal 


    Layouts
 ┣ Body
 ┃ ┗ BaseLayout.svelte
 | |_AIContentPanel
 |    |_BaseAiContentTab.svelte
 | ┣ UserControlPanel
 |    |_BaseUserControlTab.svelte
 | ┣ Content
 |
 ┣ Footer
 ┃ ┗ FooterLayout.svelte (footer load 3 seperate things from /lib/component/organisms/)
 |
 ┣ Header
 ┃ ┗ HeaderLayout.svelte (Header load 3 seperate entities from /lib/component/ )
 ┣ ┣ Navigationlogic.svelte (only Logic) (Menu will be downloaded from /lib/component/Organism/navigation/
 
 ┃ ┗ types.ts
 ┣
 ┣ BaseLayout.svelte
 ┣ LayoutManager.svelte

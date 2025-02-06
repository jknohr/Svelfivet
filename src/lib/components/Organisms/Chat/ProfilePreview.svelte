<script lang="ts">
  type Profile = {
    avatarUrl: string;
    goal?: string;
    requirements?: string;
    softWants?: string[];
    hardWants?: string[];
    dontWants?: string[];
    behavioralStatus?: string;
  };

  let { profile, detailed = false } = $props<{
    profile: Profile;
    detailed?: boolean;
  }>();
</script>

<div class="profile-preview">
  <div class="avatar">
    <img src={profile.avatarUrl} alt="Profile" />
  </div>
  
  <div class="details">
    {#if profile.goal}
      <section>
        <h3>Goal</h3>
        <p>{profile.goal}</p>
      </section>
    {/if}

    {#if detailed}
      {#if profile.requirements}
        <section>
          <h3>Requirements</h3>
          <p>{profile.requirements}</p>
        </section>
      {/if}

      {#if profile.softWants?.length}
        <section>
          <h3>Preferences</h3>
          <ul>
            {#each profile.softWants as want}
              <li>{want}</li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if profile.hardWants?.length}
        <section>
          <h3>Must Haves</h3>
          <ul>
            {#each profile.hardWants as want}
              <li>{want}</li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if profile.dontWants?.length}
        <section>
          <h3>Deal Breakers</h3>
          <ul>
            {#each profile.dontWants as want}
              <li>{want}</li>
            {/each}
          </ul>
        </section>
      {/if}
    {/if}
  </div>
</div>

<style>
  .profile-preview {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 100%;
    padding: 1rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  section {
    border-bottom: 1px solid var(--surface-3);
    padding-bottom: 0.5rem;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-2);
  }

  p {
    font-size: 0.9rem;
    line-height: 1.4;
    color: var(--text-1);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    font-size: 0.9rem;
    line-height: 1.4;
    color: var(--text-1);
    padding: 0.25rem 0;
  }

  li:before {
    content: "•";
    color: var(--color-primary);
    margin-right: 0.5rem;
  }
</style> 

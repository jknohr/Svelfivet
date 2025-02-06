<script lang="ts">
  type Props = {
    avatarUrl: string;
    goal: string;
    requirements: string;
    softWants: string[];
    hardWants: string[];
    dontWants: string[];
    behavioralStatus: string;
  };

  const props = $props();
  const { 
    avatarUrl,
    goal,
    requirements,
    softWants,
    hardWants,
    dontWants,
    behavioralStatus 
  } = props as Props;

  // Derived values for display
  const shortGoal = $derived(goal?.split(' ').slice(0, 5).join(' ') + '...');
  const statusClass = $derived(`status-${behavioralStatus?.toLowerCase() ?? 'neutral'}`);
</script>

<div class="chat-profile-user">
  <div class="avatar-container">
    <img src={avatarUrl} alt="User Avatar" class="avatar" />
    <div class={`status-indicator ${statusClass}`} title={behavioralStatus}></div>
  </div>

  <div class="profile-info">
    <div class="goal-text" title={goal}>
      {shortGoal}
    </div>

    <div class="stats">
      <div class="stat" title="Requirements">
        <span class="label">Reqs</span>
        <span class="value">{requirements ? '✓' : '–'}</span>
      </div>
      <div class="stat" title="Preferences">
        <span class="label">Prefs</span>
        <span class="value">{softWants?.length ?? 0}</span>
      </div>
      <div class="stat" title="Must Haves">
        <span class="label">Must</span>
        <span class="value">{hardWants?.length ?? 0}</span>
      </div>
      <div class="stat" title="Deal Breakers">
        <span class="label">No-Go</span>
        <span class="value">{dontWants?.length ?? 0}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .chat-profile-user {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--surface-1);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 200px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .chat-profile-user:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .avatar-container {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--surface-3);
  }

  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid var(--surface-1);
  }

  .status-active {
    background: var(--color-success);
  }

  .status-away {
    background: var(--color-warning);
  }

  .status-busy {
    background: var(--color-error);
  }

  .status-neutral {
    background: var(--text-3);
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .goal-text {
    font-size: 0.9rem;
    color: var(--text-1);
    text-align: center;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    background: var(--surface-2);
    border-radius: 8px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.7rem;
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .value {
    font-size: 0.9rem;
    color: var(--text-1);
    font-weight: 600;
  }
</style>

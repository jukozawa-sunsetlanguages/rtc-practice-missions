// Stable across reloads; matches the existing server-side deduplication identity.
export function submissionId(result) {
  return encodeURIComponent(JSON.stringify([result.studentName, result.missionId, result.missionVersion, new Date(result.completedAt).toISOString()]));
}
export function createRegistration({read, write, submit}) {
  const active = new Map();
  const session = new Map();
  const key = result => 'registrationStatus:' + submissionId(result);
  function status(result) {
    const id = submissionId(result);
    if (active.has(id)) return 'pending';
    const stored = read(key(result)) || session.get(id);
    if (stored === 'submitted' || result.registrationStatus === 'registered') return 'submitted';
    // A pending request from a previous page may have reached Google. Only explicit
    // retry resumes it; the server deduplicates using the same completion identity.
    if (stored === 'pending' || stored === 'failed' || result.registrationStatus === 'error') return 'failed';
    return null;
  }
  function send(result, retry = false) {
    const id = submissionId(result);
    if (active.has(id)) return active.get(id);
    const previous = status(result);
    console.debug('Existing localStorage registration status:', read(key(result)), 'submissionId:', id);
    if (previous === 'submitted' || (previous === 'failed' && !retry)) return Promise.resolve(previous);
    session.set(id, 'pending'); write(key(result), 'pending');
    const task = Promise.resolve().then(async () => {
      console.debug(retry ? 'Retrying training' : 'Auto-submitting training', 'submissionId:', id, 'payload:', result);
      let response;
      try { response = await submit(result); } catch (error) { response = {success:false,error:String(error)}; }
      console.debug('Training submit result:', response);
      const next = response.success ? 'submitted' : 'failed';
      session.set(id, next); write(key(result), next); active.delete(id);
      return next;
    });
    active.set(id, task);
    return task;
  }
  return {status, send};
}

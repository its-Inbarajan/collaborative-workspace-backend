export async function executeJob(job: unknown) {
    // simulate delay
    await new Promise((r) => setTimeout(r, 2000));

    if (Math.random() < 0.3) {
        throw new Error('Random execution failure');
    }
    console.log(job)
    return {
        output: 'Execution successful',
        timestamp: new Date().toISOString(),
    };
}

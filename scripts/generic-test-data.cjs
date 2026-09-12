// Read-only DB fixtures: never modify production data during verification.
const { createClient } = require('@supabase/supabase-js');
const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function getFixture(id) {
  const client = db();
  const [q, r] = await Promise.all([
    client.from('questions').select('question_number,text,options(option_index,text,type_code,score)').eq('test_id', id).order('question_number'),
    client.from('result_types').select('code,title,min_score,max_score').eq('test_id', id),
  ]);
  if (q.error || r.error) throw Error('Cannot read verification fixture: ' + id);
  const questions = q.data.map(q => ({ ...q, options: q.options.sort((a,b) => a.option_index-b.option_index) }));
  return { id, questions, results: r.data };
}
// Independent reference calculation, including existing first-seen tie behavior.
function expectedResult(fixture, choices) {
  const answers = fixture.questions.map((q,i) => q.options[choices[i]]);
  if (answers[0].type_code && answers[0].score == null) {
    const counts = {};
    answers.forEach(a => counts[a.type_code] = (counts[a.type_code] || 0) + 1);
    const code = Object.keys(counts).sort((a,b) => counts[b]-counts[a])[0];
    return { query: 'types=' + encodeURIComponent(answers.map(a => a.type_code).join(',')), result: fixture.results.find(r => r.code === code) };
  }
  const score = answers.reduce((sum,a) => sum+(a.score ?? 1),0);
  return { query: 'score='+score, result: fixture.results.find(r => r.min_score != null && r.max_score != null && score >= r.min_score && score <= r.max_score) };
}
module.exports = { getFixture, expectedResult, db };

import fetch from "node-fetch"
const githubCommitApis = [
    "https://api.github.com/repos/Snail-IDE/snail-ide.github.io/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/Snail-IDE-Vm/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/Snail-IDE-Website/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/Snail-IDE-Paint/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/Snail-IDE-Packager/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/edu/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/Desktop-Download/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/examples/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/ext-create/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/Snail-IDE-ObjectLibraries/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/OpenSnail/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/SnailPy/commits?per_page=50"
]
const lastResults = [];
let lastFetch = 0;

function getDateMs(date) {
    return (new Date(date)).getTime();
  }

function commitSort(f, s) {
    return getDateMs(s.commit.author.date) - getDateMs(f.commit.author.date);
  }

export default async (req, res) => {try {
      const fetchPromises = githubCommitApis.map(api => fetch(api));
      const responses = await Promise.all(fetchPromises);
  
      lastResults.splice(0, lastResults.length);
  
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        if (response.ok) {
          const json = await response.json();
          json.forEach(commit => {
            lastResults.push(commit);
          });
        } else {
          const text = await response.text();
          console.log("error getting commits;", text);
        }
      }
  
      console.log("got new commits")
      lastFetch = Date.now()
      res.status(200)
      res.json(lastResults.sort(commitSort))
    } catch (error) {
      console.error("Error fetching commits:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}
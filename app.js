document.addEventListener('DOMContentLoaded', () => {
    const repoInput = document.querySelector('.repo-input')
    const autocompleteList = document.querySelector('.autocomplete-list')
    const repoList = document.querySelector('.repo-list')
    let timeout = null

    repoInput.addEventListener('input', () => {
        clearTimeout(timeout)
        if (repoInput.value.length > 0) {
            timeout = setTimeout(fetchRepositories, 300)
        } else {
            autocompleteList.innerHTML = ''
        }
    })

    function fetchRepositories() {
        const query = repoInput.value
        fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
            .then(response => response.json())
            .then(data => {
                showAutocomplete(data.items)
            })
            .catch(error => console.error('Error fetching data:', error))
    }

    function showAutocomplete(repos) {
        autocompleteList.innerHTML = ''
        repos.forEach(repo => {
            const item = document.createElement('li')
            item.className = 'autocomplete-list__item'
            item.textContent = repo.full_name
            item.addEventListener('click', () => {
                addRepository(repo)
                repoInput.value = ''
                autocompleteList.innerHTML = ''
            })
            autocompleteList.appendChild(item)
        })
    }

    function addRepository(repo) {
        const repoItem = document.createElement('div')
        repoItem.className = 'repo-list__item'
        repoItem.innerHTML = `
            <div>
                <strong>${repo.name} | </strong> 🧑‍💻: ${repo.owner.login} - ⭐: ${repo.stargazers_count}
            </div>
            <button class="remove-repo">Remove</button>
        `
        repoItem.querySelector('.remove-repo').addEventListener('click', () => {
            repoList.removeChild(repoItem)
        })
        repoList.appendChild(repoItem)
    }
})

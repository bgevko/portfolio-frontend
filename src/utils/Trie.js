class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      let char = word[i];
      let node = current.children[char];
      if (!node) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
  }

  search(word) {
    let current = this.root;

    for (let i = 0; i < word.length; i++) {
      let char = word[i];
      let node = current.children[char];
      if (!node) {
        return false;
      }
      current = node;
    }
    return current.isEndOfWord;
  }

  startsWith(prefix) {
    let current = this.root;

    for (let i = 0; i < prefix.length; i++) {
      let char = prefix[i];
      let node = current.children[char];
      if (!node) {
        return false;
      }
      current = node;
    }
    return true;
  }

}

export default Trie;
// TRIE: a tree where each step down is one letter.
// Typing "dia" walks 3 steps (d -> i -> a), so the time depends on the word
// length, NOT on how many products exist. That is why big apps use it for autocomplete.
class TrieNode {
  constructor() { this.kids = {}; this.ids = []; }   // kids: next letters, ids: products passing through this node
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word, id) {
    let node = this.root;
    for (const ch of word) {
      if (!node.kids[ch]) node.kids[ch] = new TrieNode();
      node = node.kids[ch];
      if (!node.ids.includes(id)) node.ids.push(id);
    }
  }

  search(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.kids[ch];
      if (!node) return [];
    }
    return node.ids;
  }
}

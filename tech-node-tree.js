const fs = require('fs/promises');

class Node {
  constructor(name, children) {
    this.name = name
    this.children = children
  }

  getName() {
    return this.name
  }

  getChildren() {
    return this.children
  }

  printNode() {
    console.log(this.name)
  }
}

class NodeTree {
  constructor() {
    this.nodes = []
  }

  addNode(name, children) {
    this.nodes.push(new Node(name, children))
  }

  findNodeByName(nodeName) {
    for (const node of this.nodes) {
      if (node.getName() == nodeName) {
        return node
      }
    }

    console.log("Node Not Found")
    return undefined
  }

  findChildrenByParentName(parentName) {
    const parent = this.findNodeByName(parentName)
    if (!parent) return []

    const children = parent.getChildren()
    return children
  }

  findAllDescendants(node) {
    const children = this.findChildrenByParentName(node)
    const descendants = new Set(children)
    for (const child of children) {
      const newDescendants = this.findAllDescendants(child)
      newDescendants.forEach(descendant => descendants.add(descendant))
    }

    return descendants
  }

  printTree() {
    for (const node of this.nodes) {
      node.printNode()
    }
    console.log(this.nodes)
    return
  }
}

async function generateNodeTree() {
  const techTree = new NodeTree();

  const productionFacilityData = await fs.readFile('./data/JSON/productionFacilityData.json', 'utf8');
  const argoAbilityData = await fs.readFile('./data/JSON/argoAbilityData.json', 'utf8');
  const structuralData = await fs.readFile('./data/JSON/structuralData.json', 'utf8');
  const productionFacilityCards = JSON.parse(productionFacilityData);
  const argoAbilityCards = JSON.parse(argoAbilityData);
  const structuralCards = JSON.parse(structuralData);
  const cards = [...productionFacilityCards, ...argoAbilityCards, ...structuralCards]

  cards.forEach(card => {
    techTree.addNode(card.name, card.requirements);
  });

  return techTree;
}

function findRequiredBreakthroughs({ card }) {
  //take card requirements and pick through those cards' requirements, creating a list of unique cards with markers for whether they've been touched already or not
  //return number of items in above list
}

generateNodeTree().then(techTree => {
  console.log(techTree.findAllDescendants("Hypertime Oracle Sighting"))
  console.log(techTree.findAllDescendants("Hypertime Oracle Sighting").size)
});
const members = [
  {
    id: 1,
    name: "member A",
    linkId: 3,
  },
  {
    id: 2,
    name: "member B",
    linkId: 1,
  },
  {
    id: 3,
    name: "member C",
    linkId: 2,
  },
  {
    id: 4,
    name: "member D",
    linkId: null,
  },
  {
    id: 5,
    name: "member E",
    linkId: null,
  },
  {
    id: 6,
    name: "member F",
    linkId: 1,
  },
  {
    id: 7,
    name: "member G",
    linkId: 9,
  },
  {
    id: 8,
    name: "member H",
    linkId: 9,
  },
  {
    id: 9,
    name: "member I",
    linkId: null,
  },
  {
    id: 10,
    name: "member J",
    linkId: 10,
  },
  {
    id: 11,
    name: "member K",
    linkId: null,
  },
];

function membersBilledAndDependents(members) {
  //1)Determine which members should be billed
  const listOfMembersToBeBilled = [];

  //2) Identify the number and/or names of dependent children
  const dependentChildren = new Map();

  //3) Detect circular references
  const circularReferences = [];

  //Follow visited members
  let visitedMembers = [];

  function checkLink(member, ids, names) {
    if (!visitedMembers.includes(member.id)) {
      visitedMembers = [...visitedMembers, member.id];
      const visitedIds = [...ids, member.id];
      const visitedNames = [...names, member.name];

      if (member.linkId === null) {
        listOfMembersToBeBilled.push(member.name);
      } else {
        const linkedMember = members.find(
          (element) => element.id === member.linkId
        );
        if (linkedMember) {
          const dependents = dependentChildren.get(linkedMember.name) || [];
          dependentChildren.set(linkedMember.name, [
            ...dependents,
            member.name,
          ]);
          if (visitedIds.includes(linkedMember.id)) {
            circularReferences.push([...visitedNames, linkedMember.name]);
            return;
          } else {
            checkLink(linkedMember, visitedIds, visitedNames);
          }
        }
      }
    } else return;
  }

  members.forEach((member) => {
    checkLink(member, [], []);
  });

  return [listOfMembersToBeBilled, dependentChildren, circularReferences];
}

const [listOfMembersToBeBilled, dependentChildren, circularReferences] =
  membersBilledAndDependents(members);

//Determine which members should be billed
console.log(
  `1) List of members to be billed: ${listOfMembersToBeBilled.join(", ")}.`
);

//Identify the number and/or names of dependent children
console.log("2) List of dependent children:");
for (let [key, value] of dependentChildren) {
  console.log(
    `Parent ${key} has ${value.length} ${
      value.length == 1 ? "child" : "children"
    }: ${value.join(", ")}.`
  );
}

//Detect circular references
console.log("3) Circular references detected:");
for (circle of circularReferences) {
  console.log(`${circle.join(" linked to ")}.`);
}

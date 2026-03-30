export type Topic = "ecology" | "photography" | "technology" | "travel" | "personal";

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  topic: Topic;
  readTime: string;
  excerpt: string;
  content: string[];
  tags: string[];
}

const posts: BlogPost[] = [
  {
    id: "peatlands-silence",
    title: "On the Silence of Peatlands",
    date: "March 2026",
    topic: "ecology",
    readTime: "6 min read",
    excerpt:
      "Walking a Scottish blanket bog in February, I was struck not by what I could see, but by what I could hear — which was almost nothing at all.",
    content: [
      "Walking a Scottish blanket bog in February, I was struck not by what I could see, but by what I could hear — which was almost nothing at all. No wind in the trees, because there were none. No birdsong — the meadow pipits hadn't returned yet. Just the occasional creak of ice in the pools, and the sound of my own boots sinking into saturated sphagnum.",
      "Peatlands are one of those ecosystems that don't give themselves away easily. They look, to the untrained eye, like nothing much — flat, brown, waterlogged. They lack the drama of a forest or the spectacle of a coastline. But they are quietly extraordinary. A healthy blanket bog stores more carbon per hectare than any forest in Britain. It holds water in the landscape like a sponge, releasing it slowly, reducing flood risk downstream. And it supports a strange, beautiful community of specialists: sundews, bog asphodel, the haunting call of a golden plover in spring.",
      "I've been thinking about why places like this are so difficult to communicate. Part of it is the silence itself — the absence of the charismatic megafauna that fills a nature documentary segment. You can't film a peatland sequestering carbon. You can measure it, model it, write papers about it — but the actual process is invisible.",
      "There's a political dimension too. Much of Britain's upland peat has been damaged — drained for agriculture in the mid-twentieth century, burned for grouse shooting, covered in commercial forestry that was thought to be better for carbon than bare bog (it isn't). The people who depend economically on these landscapes have complicated relationships with restoration. Rewetting peat is technically straightforward; the socio-political dimensions are not.",
      "But standing there in February, boots wet, breath clouding, I felt a kind of peace that I don't easily find elsewhere. The silence wasn't empty. It was full of very slow processes — decomposition arrested by waterlogging, millennia of carbon accumulating one dead sphagnum cell at a time. The bog was working. You just had to be quiet enough to let it.",
    ],
    tags: ["ecology", "peatlands", "scotland", "carbon", "conservation"],
  },
  {
    id: "golden-hour-camera",
    title: "Light at Golden Hour: What the Camera Misses",
    date: "February 2026",
    topic: "photography",
    readTime: "5 min read",
    excerpt:
      "There is a particular quality to the last twenty minutes of daylight that no sensor I've used has managed to fully capture.",
    content: [
      "There is a particular quality to the last twenty minutes of daylight that no sensor I've used has managed to fully capture. It's not just the warmth of the light, which is easy enough to replicate in post. It's the directionality — the way golden light at a low angle creates raking shadows that reveal texture in things you didn't notice before. Bark. Grass. Stone.",
      "The problem isn't dynamic range, though that's part of it. It's more fundamental: the eye isn't a fixed aperture pointed at a fixed point. When I'm standing in a field at 5pm in October, I'm constantly adjusting — looking left at the shadow on the hedge, then right to the backlit seed heads catching the light, then down to the texture of mud. My eye is integrating across time and space in a way the camera cannot.",
      "This is obvious, of course. Everyone who photographs landscape seriously understands that the photograph is not the experience. But I find myself thinking about the gap more than I used to. Partly because I'm getting better at seeing — at noticing things I wouldn't have noticed three years ago — and better seeing makes the gap more apparent, not less.",
      "I've started keeping a small notebook when I shoot. Not to record camera settings, but to write down what I was noticing at the moment I took the shot. What the light smelled like, if that makes sense. What I was thinking about. What I had walked through to get there. The photograph, when I look at it weeks later, becomes a door back to something richer than the image itself.",
      "I'm not sure this helps me make better photographs. But I think it makes the process more honest.",
    ],
    tags: ["photography", "landscape", "light", "seeing", "process"],
  },
  {
    id: "linux-switch",
    title: "Why I Switched to Linux and Never Looked Back",
    date: "January 2026",
    topic: "technology",
    readTime: "7 min read",
    excerpt:
      "It started as a cost-saving measure during a freelance dry spell. It became something closer to a deliberate choice.",
    content: [
      "It started as a cost-saving measure during a freelance dry spell. My MacBook had died, a new one was out of budget, and I had a perfectly functional ThinkPad gathering dust. I installed Ubuntu, told myself it was temporary, and started working.",
      "That was four years ago. The switch has been permanent, and while I occasionally miss certain software — Logic Pro, mostly — I don't miss the platform. Not really.",
      "The practical reasons are easy to enumerate. Package management on Debian-based systems is substantially better than Homebrew for anyone who spends time in the terminal. The ability to understand and modify the system at any level is real, not theoretical. Hardware longevity is genuinely better — my ThinkPad runs faster on Ubuntu 24.04 than it did on Windows 10 five years ago.",
      "But there's something less tangible that I find harder to explain. Using Linux made me more intentional about software. When you choose your tools — your window manager, your text editor, your email client — rather than accepting defaults, you develop opinions. You understand what they're doing and why. This sounds tedious, and sometimes it is. But it produces a kind of clarity about the relationship between you and your machines.",
      "I'm aware this sounds evangelical. I'm not interested in evangelism — use what works for you. But if you're a developer who hasn't tried Linux seriously as a daily driver, I think the experiment is worth running.",
    ],
    tags: ["linux", "ubuntu", "open-source", "workflow", "tools"],
  },
  {
    id: "cairngorms-winter",
    title: "Three Days in the Cairngorms",
    date: "December 2025",
    topic: "travel",
    readTime: "8 min read",
    excerpt:
      "Field notes from a winter visit to Britain's largest national park, which was doing its best to be inhospitable.",
    content: [
      "Field notes from a winter visit to Britain's largest national park, which was doing its best to be inhospitable. The forecast had said 'partly cloudy.' By the time I reached Braemar, it was horizontal snow and 40 mph gusts. I set up camp anyway.",
      "The Cairngorms in winter are a different country from the Cairngorms in August. The plateau above 900m is genuinely arctic — the vegetation, the weather systems, the specialist fauna. In a good winter, you can walk for two days at altitude without dropping significantly.",
      "I had three days, a camp at Linn of Dee, and a set of objectives: some photography, some plant recording, and mostly just presence in a landscape I find endlessly compelling. I didn't see anything rare. I saw a ptarmigan, which turned and looked at me with the particular expression ptarmigan have — faintly suspicious, mostly unimpressed. I found dormant cloudberry on a peat bank and felt inordinately pleased about it.",
      "On the second day the weather broke briefly — two hours of crystalline winter light in the late afternoon. The mountains to the north, Ben Macdui and Braeriach, were plastered in new snow against a deep blue sky. I shot about 200 frames and kept maybe six. The ones I kept are some of my favourite images from the last year.",
      "The Cairngorms does something particular to me that I can't fully explain. It's partly scale — the feeling of genuinely entering a large, indifferent landscape. It's partly the ecology, which is both fragile and ancient in ways that the lowland countryside rarely feels. And it's partly just habit. I've been going there since my twenties and I know it well enough to notice change.",
    ],
    tags: ["travel", "scotland", "cairngorms", "winter", "landscape", "wildlife"],
  },
  {
    id: "urban-foxes",
    title: "The Urban Fox Problem (That Isn't One)",
    date: "November 2025",
    topic: "ecology",
    readTime: "5 min read",
    excerpt:
      "Urban foxes are one of the few true ecological success stories in British cities. The conversation about them is almost entirely dishonest.",
    content: [
      "Urban foxes are one of the few true ecological success stories in British cities. The conversation about them is almost entirely dishonest.",
      "The tabloid narrative — dangerous foxes attacking babies, populations out of control — resurfaces every few years, usually following a single incident that gets amplified far beyond its ecological significance. The actual picture is more interesting and less alarming.",
      "Red foxes in British cities have been present since at least the 1930s, when suburban expansion first created the mosaic of gardens, railway embankments, and small parks that foxes find congenial. Urban fox density in some London boroughs is substantially higher than rural fox density per square kilometre, but this reflects habitat suitability, not some runaway population explosion. Urban populations are self-regulating — disease, vehicle strikes, and territorial behaviour keep densities relatively stable.",
      "What's actually happening ecologically is fascinating. Urban foxes have changed their behaviour in measurable ways compared to their rural relatives. They are more tolerant of human proximity, more nocturnal in some contexts, more omnivorous. There's ongoing research into whether urban and rural populations are diverging genetically — tentative evidence suggests they might be.",
      "The people most dismissive of urban foxes tend to be people who don't watch them carefully. The people who do watch them — with camera traps in gardens, notes on breeding pairs, observations over years — tend to find them endlessly interesting. This seems like the right response to a wild animal that has successfully colonised one of the world's most urbanised landscapes.",
    ],
    tags: ["urban ecology", "foxes", "wildlife", "uk", "cities"],
  },
  {
    id: "35mm-prime",
    title: "Everything I've Learned Shooting with a 35mm",
    date: "October 2025",
    topic: "photography",
    readTime: "6 min read",
    excerpt:
      "The 35mm prime is boring, unfashionable, and has taught me more about seeing than any other piece of equipment I've owned.",
    content: [
      "The 35mm prime is boring, unfashionable, and has taught me more about seeing than any other piece of equipment I've owned.",
      "I went through the normal progression: kit zoom, then better zoom, then the realisation that focal length flexibility was obscuring a more fundamental problem — I didn't have a natural way of seeing. A zoom lens allows you to frame from where you're standing. A prime forces you to move.",
      "Moving is, it turns out, the important thing. Not in the sense that closer is always better — sometimes you need to back up, to include more foreground, to change your relationship to the light. But the physical act of moving, of committing your body to a position, makes you more present and more intentional. You stop trying to find the composition with the zoom ring and start finding it with your feet.",
      "The 35mm specifically I chose for the field of view — close enough to 40mm to feel natural, but wider than the 50mm which I found restrictive in landscape. It's unfashionable because it doesn't have the obvious character of wider primes or longer ones. It just shows you things approximately as they look. Which is humbling.",
      "Three years in, I use it for almost everything. The variable is no longer the lens. The variable is me.",
    ],
    tags: ["photography", "prime lens", "35mm", "technique", "seeing"],
  },
  {
    id: "erp-migration",
    title: "Migrating an ERP with No Downtime",
    date: "September 2025",
    topic: "technology",
    readTime: "9 min read",
    excerpt:
      "A small manufacturer, two legacy systems, one weekend, and a migration plan that had to work the first time.",
    content: [
      "A small manufacturer, two legacy systems, one weekend, and a migration plan that had to work the first time. This is a write-up of what we did and what I'd do differently.",
      "The client had been running core operations on a combination of a mid-2000s Access database and a cloud invoicing tool that didn't talk to each other. Data was reconciled manually in Excel every Friday. The business had grown to the point where this was taking half a day of a finance manager's time per week, and the error rate was becoming untenable.",
      "The solution was an Odoo implementation with custom modules for their workflow — they manufacture specialist technical equipment, and the standard Odoo manufacturing module needed significant adaptation. I'd done the customisation over three months. The migration weekend was the part that kept me awake.",
      "The strategy was a parallel run: both systems live simultaneously, with automated sync from the old system to the new, then a hard cutover on Sunday evening. The sync was the technical challenge — the Access database had no API, so we were polling it via ODBC every fifteen minutes and transforming data through a Python middleware layer I wrote for the purpose.",
      "What went wrong: the Access database had inconsistent date formatting in about 3% of records. We found this at 11pm on Saturday. What went right: we found it at 11pm on Saturday rather than 3pm on Monday. The fix was ninety minutes of work. The business has been running cleanly on Odoo for eight months now.",
    ],
    tags: ["ERP", "Odoo", "migration", "consulting", "infrastructure", "Python"],
  },
  {
    id: "dawn-surveys",
    title: "Dawn Surveys and What They Teach You",
    date: "August 2025",
    topic: "ecology",
    readTime: "4 min read",
    excerpt:
      "The alarm goes at 3:45. It's August, and the first census point is twenty minutes' walk from the car park.",
    content: [
      "The alarm goes at 3:45. It's August, and the first census point is twenty minutes' walk from the car park. This is not optional.",
      "Point count surveys for breeding birds have to be conducted early — within a couple of hours of first light — because that's when detection probability is highest. Birds sing most actively at dawn. If you do your surveys at 9am, you'll miss things. If your data has to be comparable to data collected by other surveyors using the same methodology, you don't get to make exceptions.",
      "I've been doing ecological fieldwork long enough that early starts feel normal, but I remember when they didn't. The first few times, I resented it. Then I started to understand it.",
      "There's a quality to early morning light that photographers know and ecologists know and almost nobody else does, because almost nobody else is reliably outside before 6am. The world is doing something particular in that window. Not just the birds — the whole landscape behaves differently. Deer in fields they'd have left by eight. Otters on rivers they'd have abandoned by seven.",
      "I collect data at dawn. I also collect something else — a habit of presence in the early morning that I find I'm reluctant to give up even when I don't have surveys to do. Coffee at 5am, watching a garden that's doing something you'd otherwise miss entirely.",
    ],
    tags: ["ecology", "fieldwork", "birds", "surveys", "dawn", "seasonal"],
  },
  {
    id: "fieldwork-debugging",
    title: "What Fieldwork Taught Me About Debugging",
    date: "July 2025",
    topic: "personal",
    readTime: "5 min read",
    excerpt:
      "The two disciplines are more similar than they appear. Both involve forming hypotheses about systems you can't fully observe.",
    content: [
      "The two disciplines are more similar than they appear. Both involve forming hypotheses about systems you can't fully observe.",
      "In ecological fieldwork, you're trying to understand the state of a population or community from a sample. You can't count every individual; you count a representative fraction and infer from that. The validity of your inference depends on your sampling method, your detection probability, and your ability to notice when your assumptions are wrong.",
      "In debugging, you're trying to understand the state of a system from its outputs — logs, error messages, observable behaviour. You can't see the full state of the system at any moment; you infer from what's visible. The validity of your diagnosis depends on the quality of your instrumentation, your model of how the system should behave, and your ability to distinguish between symptoms and causes.",
      "The psychological parallels are what interest me most. In both fields, the most dangerous state is confident wrongness — when your mental model is plausible enough to feel right but wrong enough to be actively misleading. In ecology, this looks like missing a species because you're sure it's not there. In debugging, it looks like spending three hours investigating the database because the problem feels like it must be the database.",
      "The corrective in both cases is the same: find a way to be surprised. Design observations that could falsify your hypothesis. The disconfirming datum, in both fields, is more valuable than ten confirming ones.",
    ],
    tags: ["ecology", "technology", "debugging", "fieldwork", "thinking"],
  },
  {
    id: "rewilding-nuance",
    title: "The Rewilding Debate Needs More Nuance",
    date: "June 2025",
    topic: "ecology",
    readTime: "7 min read",
    excerpt:
      "Rewilding has become a word that does too much work — covering everything from passive land management to reintroducing wolves. These are not the same project.",
    content: [
      "Rewilding has become a word that does too much work. It covers everything from passive management on a grouse moor to reintroducing wolves to Scotland. These are not the same project.",
      "The conceptual origin of rewilding is in conservation biology — specifically, the argument by Soulé and Noss in the 1990s that large-scale reserves with corridors and keystone species were necessary to maintain biodiversity in fragmented landscapes. The 'cores, corridors, and carnivores' framework. This is a coherent scientific argument about ecosystem function.",
      "What rewilding has become in British public discourse is something else: a loose aspiration towards landscapes that feel more natural, more diverse, more wild. This aspiration is often good. But the scientific precision of the original concept has been diluted to the point where rewilding can mean almost anything that isn't intensively managed farmland.",
      "This matters practically because the arguments for different interventions are quite different. The case for passive management — stopping burning, reducing grazing pressure, letting scrub establish — is relatively uncontroversial among ecologists. The case for species reintroductions varies enormously by species. Beaver reintroductions have been broadly successful and the ecological benefits are measurable. Wolf reintroduction raises complex questions about livestock predation, compensation, and the cultural politics of rural land use.",
      "The people who are most dismissive of rewilding tend to be wrong. The people who are most enthusiastic about it sometimes oversimplify. The interesting arguments are in the middle.",
    ],
    tags: ["ecology", "rewilding", "conservation", "policy", "opinion", "uk"],
  },
];

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getTopicCounts(): { topic: Topic; count: number }[] {
  const counts: Partial<Record<Topic, number>> = {};
  posts.forEach((p) => {
    counts[p.topic] = (counts[p.topic] ?? 0) + 1;
  });
  return Object.entries(counts).map(([topic, count]) => ({
    topic: topic as Topic,
    count: count as number,
  }));
}

import FlowingMenu from "../ui/interactive/FlowingMenu";

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];

const ProjectsList: React.FC = () => {
  return (
    <div>
        <div className="mx-auto bg-[#120F17] py-5 lg:mx-0 justify center items-center w-full text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">Recent projects</h2>
          {/* <p className="mt-2 text-lg/8 text-gray-300">Learn how to grow your business with our expert advice.</p> */}
        </div>

 <div style={{ height: '600px', position: 'relative' }}>
  <FlowingMenu items={demoItems}
  speed={15}
  textColor="#ffffff"
  bgColor="#120F17"
  marqueeBgColor="#ffffff"
  marqueeTextColor="#120F17"
  borderColor="#ffffff"
/>
</div>
</div>
  );
};

export default ProjectsList;
import { useState, useEffect } from 'react';
import { TableOfContents as TOCIcon} from 'lucide-react';
import { X } from 'lucide-react';

function useActiveSection(ids) {
  const [activeId, setActiveId] = useState('');
  

  useEffect(() => {
    const rootMarginB = -window.innerHeight + 80;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: `-50px 0px ${rootMarginB}px 0px` }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [ids]);

  return activeId;
}

export default function TableOfContents({ data }) {
  const ids = data.map(item => item.slug);
  const activeId = useActiveSection(ids);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openTOC", handleOpen);
    return () => window.removeEventListener("openTOC", handleOpen);
  }, []);

   const openTOC = () => {
    setIsOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeTOC = () => {
    setIsOpen(false);
    // console.log("close clicked!")
    document.body.classList.remove("overflow-hidden");
  };

  return (<>
    <div id="toc-float" onClick={openTOC} className='w-15 h-15 z-3 text-secondary bg-secondary-foreground/90 fixed bottom-4 right-4 flex justify-center items-center rounded-full lg:hidden'><TOCIcon className={`stroke-3 size-8 ${isOpen ? "hidden" : "flex"}`}/><X className={`stroke-3 size-8 ${isOpen ? "flex" : "hidden"}`}/></div>
    <div id="toc-overlay" onClick={closeTOC} className={`bg-black/40 fixed w-full h-full left-0 top-0 lg:hidden ${isOpen ? "flex" : "hidden"}`}></div>
    <nav id="toc" aria-label="Table of contents" className={`${isOpen ? "flex" : "hidden"} bg-white min-w-77 max-w-80 rounded-lg px-0 flex-col gap-2 pb-2 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:flex lg:sticky lg:top-8 lg:left-0 lg:translate-0 lg:px-2 lg:min-w-70`}>
      <div className='flex items-center gap-2 text-white bg-secondary-foreground/90 px-1 py-1.5 rounded-lg justify-center'>
        <TOCIcon className="stroke-[3px] mb-0.5"/>
        <h2 className="text-2xl font-bold tracking-normal p-0"> Table of Contents</h2>
        <div onClick={closeTOC} className='text-red-500 bg-white w-6 h-6 ml-5 p-1 rounded-full flex justify-center items-center lg:hidden'><X className='stroke-5'/></div>
      </div>
      <ul className="space-y-2.5 pl-8 pr-2 max-h-100 overflow-y-scroll my-2 mr-2 lg:pl-7 lg:max-h-150">
        {data.map(item => (
          <li
          key={item.slug}
          className={`
            ${item.depth === 2 ? 'ml-0' : item.depth === 3 ? 'ml-4' : item.depth === 4 ? 'ml-8' : ''}
            ${item.slug === activeId ? 'font-bold aria-current' : 'text-gray-600'}
            ${item.depth === 2 ? 'text-base' : 'text-sm'}
            leading-[120%] relative
          `}
        >          
            {item.slug === activeId && <span className="mr-1 text-2xl leading-[100%] absolute -left-5 -top-[3.5px] text-secondary-500">›</span>}
            <a href={`#${item.slug}`} className="hover:underline" aria-current={item.slug === activeId ? "true" : undefined}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
    </>
  );
}

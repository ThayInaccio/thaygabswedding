import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Box, 
  Drawer, 
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EventIcon from '@mui/icons-material/Event';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import RsvpIcon from '@mui/icons-material/Rsvp';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const StyledAppBar = styled(AppBar)<{ $shouldShowDropdown: boolean }>(({ $shouldShowDropdown }) => ({
  background: 'transparent',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&.scrolled': {
    backgroundColor: $shouldShowDropdown ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    backdropFilter: $shouldShowDropdown ? 'blur(10px)' : 'none',
  },
}));

const StyledToolbar = styled(Toolbar)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '1rem 2rem',
  '@media (max-width: 600px)': {
    padding: '0.5rem 1rem',
  },
}));

const HeaderSideContainer = styled(Box)({
  flex: 1,
  display: 'flex',
});

const Initials = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$isHomePage' && prop !== '$shouldShowDropdown',
})<{ $isHomePage?: boolean; $shouldShowDropdown?: boolean }>(({ $isHomePage, $shouldShowDropdown }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 200,
  fontSize: '1.8rem',
  color: $isHomePage && !$shouldShowDropdown ? '#FFFFFF' : '#8B0000',
  transition: 'color 0.3s ease',
  textDecoration: 'none',
}));

const NavLinks = styled(Box)(() => ({
  display: 'flex',
  gap: '2rem',
  '@media (max-width: 960px)': {
    gap: '1.5rem',
  },
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== '$isHomePage',
})<{ $isHomePage?: boolean }>(({ $isHomePage }) => ({
  color: $isHomePage ? '#FFFFFF' : '#8B0000',
  textDecoration: 'none',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: '1rem',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: $isHomePage ? '#E0E0E0' : '#600000',
  },
}));

const MobileMenuButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== '$isHomePage' && prop !== '$shouldShowDropdown',
})<{ $isHomePage?: boolean; $shouldShowDropdown?: boolean }>(({ $isHomePage, $shouldShowDropdown }) => ({
  color: $isHomePage && !$shouldShowDropdown ? '#FFFFFF' : '#8B0000',
  '@media (min-width: 600px)': {
    display: 'none',
  },
}));

const DropdownMenuButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== '$isHomePage' && prop !== '$shouldShowDropdown',
})<{ $isHomePage?: boolean; $shouldShowDropdown?: boolean }>(({ $isHomePage, $shouldShowDropdown }) => ({
  color: $isHomePage && !$shouldShowDropdown ? '#FFFFFF' : '#8B0000',
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

const DropdownMenuText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$isHomePage' && prop !== '$shouldShowDropdown',
})<{ $isHomePage?: boolean; $shouldShowDropdown?: boolean }>(({ $isHomePage, $shouldShowDropdown }) => ({
  color: $isHomePage && !$shouldShowDropdown ? '#FFFFFF' : '#8B0000',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: '0.9rem',
  marginRight: '0.5rem',
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

const StyledMenu = styled(Menu)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(139, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    marginTop: '0.5rem',
    minWidth: '200px',
  },
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  color: '#FFFFFF',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: '0.9rem',
  padding: '0.75rem 1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#E0E0E0',
  },
  '& .MuiListItemIcon-root': {
    color: 'inherit',
    minWidth: '36px',
  },
}));

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    backgroundColor: 'rgba(139, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    width: '250px',
    padding: '2rem 1rem',
  },
}));

const DrawerNavLinks = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginTop: '2rem',
}));

const DrawerNavLink = styled(Link)(() => ({
  color: '#FFFFFF',
  textDecoration: 'none',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: '1.1rem',
  padding: '0.5rem 0',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#E0E0E0',
  },
}));

const AdminLink = styled(MuiLink, {
  shouldForwardProp: (prop) => prop !== '$isHomePage' && prop !== '$shouldShowDropdown',
})<{ $isHomePage?: boolean; $shouldShowDropdown?: boolean }>(({ $isHomePage, $shouldShowDropdown }) => ({
  color: $isHomePage && !$shouldShowDropdown ? 'rgba(255, 255, 255, 0.7)' : 'rgba(139, 0, 0, 0.7)',
  textDecoration: 'none',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  fontSize: '0.8rem',
  transition: 'color 0.3s ease',
  marginRight: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  '&:hover': {
    color: $isHomePage && !$shouldShowDropdown ? '#FFFFFF' : '#8B0000',
  },
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);
  const [isRsvpVisible, setIsRsvpVisible] = useState(false);
  const [isWeddingDetailsVisible, setIsWeddingDetailsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Check if any section that should show dropdown is visible
  const shouldShowDropdown = isAboutVisible || isCountdownVisible || isRsvpVisible || isWeddingDetailsVisible || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const aboutSection = document.getElementById('about');
    const countdownSection = document.getElementById('countdown');
    const rsvpSection = document.getElementById('rsvp');
    const weddingDetailsSection = document.getElementById('wedding-details');
    
    if (!aboutSection || !countdownSection || !rsvpSection || !weddingDetailsSection) return;

    const aboutObserver = new IntersectionObserver(
      ([entry]) => {
        setIsAboutVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const countdownObserver = new IntersectionObserver(
      ([entry]) => {
        setIsCountdownVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const rsvpObserver = new IntersectionObserver(
      ([entry]) => {
        setIsRsvpVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const weddingDetailsObserver = new IntersectionObserver(
      ([entry]) => {
        setIsWeddingDetailsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    aboutObserver.observe(aboutSection);
    countdownObserver.observe(countdownSection);
    rsvpObserver.observe(rsvpSection);
    weddingDetailsObserver.observe(weddingDetailsSection);

    return () => {
      aboutObserver.unobserve(aboutSection);
      countdownObserver.unobserve(countdownSection);
      rsvpObserver.unobserve(rsvpSection);
      weddingDetailsObserver.unobserve(weddingDetailsSection);
    };
  }, [location.pathname]);

  const navItems = [
    { label: 'Confirmar Presença', path: '/rsvp', icon: <RsvpIcon /> },
    { label: 'Presentes', path: '/gifts', icon: <CardGiftcardIcon /> },
    { label: 'Nossa História', path: '/#about', icon: <FavoriteIcon /> },
    { label: 'Local', path: '/#wedding-details', icon: <EventIcon /> },
  ];

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDropdownAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  const handleNavItemClick = (path: string) => {
    handleDropdownClose();
    if (path.startsWith('/#')) {
      const anchor = path.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(anchor);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300); // Wait for navigation/render
      } else {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(path);
    }
  };

  return (
    <StyledAppBar
      position="fixed"
      className={isScrolled ? 'scrolled' : ''}
      $shouldShowDropdown={shouldShowDropdown}
    >
      <StyledToolbar>
        <HeaderSideContainer>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Initials $isHomePage={isHomePage} $shouldShowDropdown={shouldShowDropdown}>
              T&G
            </Initials>
          </Link>
        </HeaderSideContainer>
        
        {/* Show horizontal nav links when on home page and no special section is visible */}
        {isHomePage && !shouldShowDropdown && (
          <NavLinks>
            {navItems.map((item) => (
              item.path.startsWith('/#') ? (
                <NavLink
                  key={item.path}
                  to="#"
                  as="a"
                  $isHomePage={isHomePage}
                  onClick={e => {
                    e.preventDefault();
                    handleNavItemClick(item.path);
                  }}
                >
                  {item.label}
                </NavLink>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  $isHomePage={isHomePage}
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </NavLinks>
        )}

        <HeaderSideContainer sx={{ justifyContent: 'flex-end' }}>
          {/* Admin Link - only show when not on home page or when dropdown is active */}
          {shouldShowDropdown && (
            <AdminLink
              href="/admin/login"
              $isHomePage={isHomePage}
              $shouldShowDropdown={shouldShowDropdown}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: '1rem' }} />
              Admin
            </AdminLink>
          )}
          
          {/* Show dropdown menu when special sections are visible OR not on home page */}
          {shouldShowDropdown && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DropdownMenuText $isHomePage={isHomePage} $shouldShowDropdown={shouldShowDropdown}>
                Menu
              </DropdownMenuText>
              <DropdownMenuButton
                edge="end"
                aria-label="menu"
                onClick={handleDropdownOpen}
                $isHomePage={isHomePage}
                $shouldShowDropdown={shouldShowDropdown}
              >
                <KeyboardArrowDownIcon />
              </DropdownMenuButton>
            </Box>
          )}
          
          {/* Show mobile menu button on all pages (mobile only) */}
          <MobileMenuButton
            edge="end"
            aria-label="menu"
            onClick={toggleMobileMenu}
            $isHomePage={isHomePage}
            $shouldShowDropdown={shouldShowDropdown}
          >
            <MenuIcon />
          </MobileMenuButton>
        </HeaderSideContainer>
      </StyledToolbar>

      {/* Dropdown Menu */}
      <StyledMenu
        anchorEl={dropdownAnchorEl}
        open={Boolean(dropdownAnchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {navItems.map((item) => (
          <StyledMenuItem
            key={item.path}
            onClick={() => handleNavItemClick(item.path)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </StyledMenuItem>
        ))}
      </StyledMenu>

      {/* Mobile Drawer */}
      <StyledDrawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleMobileMenu}
      >
        <DrawerNavLinks>
          {navItems.map((item) => (
            item.path.startsWith('/#') ? (
              <DrawerNavLink
                key={item.path}
                to="#"
                as="a"
                onClick={e => {
                  e.preventDefault();
                  handleNavItemClick(item.path);
                  toggleMobileMenu();
                }}
              >
                {item.label}
              </DrawerNavLink>
            ) : (
              <DrawerNavLink
                key={item.path}
                to={item.path}
                onClick={toggleMobileMenu}
              >
                {item.label}
              </DrawerNavLink>
            )
          ))}
        </DrawerNavLinks>
      </StyledDrawer>
    </StyledAppBar>
  );
};

export default Header; 